import io
import json
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path
from unittest.mock import Mock, patch
from urllib.error import HTTPError, URLError
from urllib.request import HTTPRedirectHandler, Request

from pydantic import ValidationError

from pravopisac_authoring.cli import main, read_document
from pravopisac_authoring.client import AuthoringError, ChatClient, Completion
from pravopisac_authoring.models import (
    Artifact,
    Brief,
    Comparison,
    Critique,
    Draft,
    HumanReview,
    ModelCall,
)
from pravopisac_authoring.pipeline import (
    digest,
    record_review,
    run_pilot,
    verify_review,
)

FIXTURES = Path(__file__).parent / "fixtures"


def fixture(name):
    return json.loads((FIXTURES / f"{name}.json").read_text(encoding="utf-8"))


def parse(model, data):
    return model.model_validate_json(json.dumps(data))


class StubClient:
    generator_model = "synthetic-generator"
    critic_model = "synthetic-critic"

    def __init__(self, responses=None):
        self.responses = (
            [json.dumps(fixture("draft")), json.dumps(fixture("critique"))]
            if responses is None else responses
        )
        self.calls = []

    def complete(self, *, model, system, user):
        self.calls.append({"model": model, "system": system, "user": user})
        return Completion(
            content=self.responses[len(self.calls) - 1],
            provenance=ModelCall(
                requested_model=model,
                returned_model=f"{model}-fixture-version",
                response_id=f"synthetic-response-{len(self.calls)}",
            ),
        )


def artifact(client=None, comparison=None):
    return run_pilot(
        parse(Brief, fixture("brief")),
        parse(Comparison, fixture("comparison")) if comparison is None else comparison,
        StubClient() if client is None else client,
    )


class ContractTests(unittest.TestCase):
    def test_every_document_requires_exact_integer_schema_version_one(self):
        result = artifact()
        review = record_review(
            result,
            reviewer_id="synthetic-test-reviewer",
            decision="approved",
            note="Synthetic test attestation only.",
            human_reviewed=True,
        )
        documents = (
            (Brief, fixture("brief")),
            (Comparison, fixture("comparison")),
            (Draft, fixture("draft")),
            (Critique, fixture("critique")),
            (Artifact, result.model_dump(mode="json", by_alias=True)),
            (HumanReview, review.model_dump(mode="json")),
        )
        for model, data in documents:
            with self.subTest(model=model.__name__, version=1):
                self.assertIs(type(parse(model, data).schema_version), int)
            for value in (True, False, 1.0, 0, 2, "1", None):
                with self.subTest(model=model.__name__, version=value):
                    with self.assertRaises(ValidationError):
                        parse(model, {**data, "schema_version": value})

    def test_two_choice_contract_matches_browser_fields(self):
        draft = parse(Draft, fixture("draft"))
        self.assertEqual(draft.question.correct_index, 0)
        self.assertEqual(
            set(draft.question.model_dump(by_alias=True)),
            {"id", "prompt", "options", "correctIndex", "explanation"},
        )

    def test_invalid_question_shapes_and_model_approval_are_rejected(self):
        cases = [
            ("correctIndex", True),
            ("correctIndex", "0"),
            ("correctIndex", 1.0),
            ("correctIndex", -1),
            ("correctIndex", 2),
            ("options", ["Only one"]),
            ("options", ["One", "Two", "Three"]),
            ("options", ["Probni odgovor A", "  PROBNI  odgovor Ａ "]),
            ("prompt", " \t "),
            ("explanation", ""),
            ("approved", True),
        ]
        for field, value in cases:
            with self.subTest(field=field, value=value):
                data = fixture("draft")
                data["question"][field] = value
                with self.assertRaises(ValidationError):
                    parse(Draft, data)
        for field in ("approval", "human_review", "reviewer_id"):
            with self.subTest(field=field):
                data = fixture("draft")
                data[field] = "model-generated claim"
                with self.assertRaises(ValidationError):
                    parse(Draft, data)

    def test_brief_requires_explicit_decisions_and_permissions(self):
        for field in (
            "learner_group", "topic", "learning_objective", "reviewer_id", "sources",
            "brief_approved", "source_sharing_approved",
        ):
            with self.subTest(missing=field):
                data = fixture("brief")
                del data[field]
                with self.assertRaises(ValidationError):
                    parse(Brief, data)
        for field in ("brief_approved", "source_sharing_approved"):
            for value in (False, "true", 1):
                with self.subTest(field=field, value=value):
                    data = fixture("brief")
                    data[field] = value
                    with self.assertRaises(ValidationError):
                        parse(Brief, data)
        for sources in ([], fixture("brief")["sources"] * 2):
            data = fixture("brief")
            data["sources"] = sources
            with self.assertRaises(ValidationError):
                parse(Brief, data)

    def test_comparison_set_is_explicit_and_internally_unique(self):
        with self.assertRaises(ValidationError):
            parse(Comparison, {"schema_version": 1})
        question = fixture("draft")["question"]
        with self.assertRaises(ValidationError):
            parse(Comparison, {"schema_version": 1, "questions": [question, question]})


class PipelineTests(unittest.TestCase):
    def test_two_bounded_calls_with_actual_evidence_and_provenance(self):
        client = StubClient()
        result = artifact(client)
        self.assertEqual(len(client.calls), 2)
        self.assertEqual(result.state, "unreviewed")
        self.assertEqual(result.generator.response_id, "synthetic-response-1")
        self.assertEqual(result.critic.response_id, "synthetic-response-2")
        for call in client.calls:
            context = json.loads(call["user"])
            brief_context = context.get("brief", context)
            self.assertEqual(
                brief_context["sources"], fixture("brief")["sources"]
            )
            self.assertNotIn("reviewer_id", brief_context)
        self.assertEqual(
            json.loads(client.calls[1]["user"])["draft"], fixture("draft")
        )
        self.assertEqual(
            result.validation_checks,
            ("structure", "source_ids", "exact_quotes", "normalized_duplicates"),
        )
        self.assertEqual(result.critique.findings, ())

    def test_bad_draft_stops_before_critic_without_retry(self):
        invalid_versions = [
            json.dumps({**fixture("draft"), "schema_version": value})
            for value in (True, 1.0)
        ]
        for content in ("not JSON", '{"approved": true}', *invalid_versions):
            client = StubClient([content])
            with self.assertRaises(ValidationError):
                artifact(client)
            self.assertEqual(len(client.calls), 1)

    def test_unknown_or_fabricated_evidence_stops_before_critic(self):
        for field, value in (
            ("source_id", "not-a-source"),
            ("quote", "Invented evidence not in the source."),
        ):
            data = fixture("draft")
            data["evidence"][0][field] = value
            client = StubClient([json.dumps(data)])
            with self.assertRaisesRegex(ValueError, "source"):
                artifact(client)
            self.assertEqual(len(client.calls), 1)

    def test_duplicate_id_or_normalized_question_stops_before_critic(self):
        for duplicate_id in (True, False):
            with self.subTest(duplicate_id=duplicate_id):
                question = fixture("draft")["question"]
                if duplicate_id:
                    question["prompt"] = "A different synthetic prompt"
                else:
                    question["id"] = "another-synthetic-id"
                    question["prompt"] = " \t" + question["prompt"].upper() + "\n"
                    question["options"].reverse()
                    question["correctIndex"] = 1
                comparison = parse(
                    Comparison, {"schema_version": 1, "questions": [question]}
                )
                client = StubClient()
                with self.assertRaisesRegex(ValueError, "already exists"):
                    artifact(client, comparison)
                self.assertEqual(len(client.calls), 1)

    def test_critic_cannot_approve_or_invent_source_evidence(self):
        bad_approval = fixture("critique")
        bad_approval["approved"] = True
        bad_evidence = fixture("critique")
        bad_evidence["findings"] = [{
            "concern": "Synthetic concern",
            "evidence": [{
                "source_id": "demo-reference",
                "quote": "A quote that does not exist.",
                "reason": "Synthetic reason",
            }],
        }]
        for data in (bad_approval, bad_evidence):
            client = StubClient([
                json.dumps(fixture("draft")), json.dumps(data)
            ])
            with self.assertRaises(ValidationError):
                artifact(client)
            self.assertEqual(len(client.calls), 2)

    def test_cited_critic_concern_is_preserved_for_human_judgment(self):
        critique = fixture("critique")
        critique["findings"] = [{
            "concern": "This fixture cannot be used as an orthography exercise.",
            "evidence": [{
                "source_id": "demo-reference",
                "quote": "This is not an orthography rule.",
                "reason": "The reference explicitly identifies synthetic material.",
            }],
        }]
        result = artifact(StubClient([
            json.dumps(fixture("draft")), json.dumps(critique)
        ]))
        self.assertEqual(len(result.critique.findings), 1)
        self.assertEqual(result.state, "unreviewed")


class ReviewTests(unittest.TestCase):
    def setUp(self):
        self.artifact = artifact()

    def review(self, **overrides):
        args = {
            "reviewer_id": "synthetic-test-reviewer",
            "decision": "approved",
            "note": "Automated synthetic test only; not a real human approval.",
            "human_reviewed": True,
        }
        args.update(overrides)
        return record_review(self.artifact, **args)

    def test_separate_review_matches_exact_revision_not_json_formatting(self):
        review = self.review()
        roundtrip = Artifact.model_validate_json(
            self.artifact.model_dump_json(indent=4, by_alias=True)
        )
        verify_review(roundtrip, review)
        self.assertEqual(digest(self.artifact), digest(roundtrip))
        self.assertEqual(self.artifact.state, "unreviewed")
        self.assertNotIn("approved", self.artifact.model_dump())

    def test_changed_question_or_reference_invalidates_approval(self):
        review = self.review()
        for section in ("question", "reference"):
            with self.subTest(section=section):
                data = self.artifact.model_dump(mode="json", by_alias=True)
                if section == "question":
                    data["draft"]["question"]["explanation"] += " Changed demo wording."
                else:
                    data["brief"]["sources"][0]["edition"] = "fixture-v2"
                changed = parse(Artifact, data)
                with self.assertRaisesRegex(AuthoringError, "stale"):
                    verify_review(changed, review)

    def test_wrong_reviewer_no_attestation_and_blank_note_are_rejected(self):
        with self.assertRaisesRegex(AuthoringError, "Reviewer"):
            self.review(reviewer_id="someone-else")
        for overrides in ({"human_reviewed": False}, {"note": "  "}):
            with self.assertRaises(ValidationError):
                self.review(**overrides)

    def test_rejection_and_requested_changes_are_not_approval(self):
        for decision in ("rejected", "changes_requested"):
            review = self.review(decision=decision)
            with self.assertRaisesRegex(AuthoringError, "not approved"):
                verify_review(self.artifact, review)

    def test_no_embedded_model_approval(self):
        data = self.artifact.model_dump(mode="json", by_alias=True)
        data["human_review"] = self.review().model_dump(mode="json")
        with self.assertRaises(ValidationError):
            parse(Artifact, data)

    def test_verifier_checks_reviewer_even_with_matching_digest(self):
        review = self.review()
        data = review.model_dump(mode="json")
        data["reviewer_id"] = "someone-else"
        with self.assertRaisesRegex(AuthoringError, "Reviewer"):
            verify_review(self.artifact, parse(HumanReview, data))


class CliTests(unittest.TestCase):
    def invoke(self, args):
        stdout, stderr = io.StringIO(), io.StringIO()
        with redirect_stdout(stdout), redirect_stderr(stderr):
            status = main(args)
        return status, stdout.getvalue(), stderr.getvalue()

    def test_complete_synthetic_cli_flow_and_stale_approval(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "run.json"
            review = Path(directory) / "review.json"
            client = StubClient()
            with patch(
                "pravopisac_authoring.cli.ChatClient.from_env", return_value=client
            ):
                status, stdout, stderr = self.invoke([
                    "draft", "--brief", str(FIXTURES / "brief.json"),
                    "--comparison", str(FIXTURES / "comparison.json"),
                    "--output", str(output),
                ])
            self.assertEqual((status, stderr), (0, ""))
            self.assertIn("unproven", stdout)
            self.assertEqual(len(client.calls), 2)
            self.assertEqual(read_document(output, Artifact).state, "unreviewed")
            status, stdout, stderr = self.invoke([
                "review", "--artifact", str(output),
                "--reviewer", "synthetic-test-reviewer", "--decision", "approved",
                "--note", "Synthetic test attestation only.", "--human-reviewed",
                "--output", str(review),
            ])
            self.assertEqual((status, stderr), (0, ""))
            self.assertIn("Recorded human decision: approved", stdout)
            args = [
                "verify-review", "--artifact", str(output), "--review", str(review)
            ]
            self.assertEqual(self.invoke(args)[0], 0)
            data = json.loads(output.read_text(encoding="utf-8"))
            data["draft"]["question"]["explanation"] += " Changed demo wording."
            output.write_text(json.dumps(data), encoding="utf-8")
            status, stdout, stderr = self.invoke(args)
            self.assertEqual((status, stdout), (1, ""))
            self.assertIn("stale", stderr)

    def test_existing_output_prevents_even_configuring_a_model(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "existing.json"
            output.write_text("keep me", encoding="utf-8")
            with patch("pravopisac_authoring.cli.ChatClient.from_env") as factory:
                status, _, stderr = self.invoke([
                    "draft", "--brief", str(FIXTURES / "brief.json"),
                    "--comparison", str(FIXTURES / "comparison.json"),
                    "--output", str(output),
                ])
            self.assertEqual(status, 1)
            self.assertIn("Refusing to overwrite", stderr)
            factory.assert_not_called()
            self.assertEqual(output.read_text(encoding="utf-8"), "keep me")

    def test_invalid_brief_prevents_even_configuring_a_model(self):
        with tempfile.TemporaryDirectory() as directory:
            brief = Path(directory) / "brief.json"
            output = Path(directory) / "run.json"
            data = {**fixture("brief"), "schema_version": True}
            brief.write_text(json.dumps(data), encoding="utf-8")
            with patch("pravopisac_authoring.cli.ChatClient.from_env") as factory:
                status, stdout, stderr = self.invoke([
                    "draft", "--brief", str(brief),
                    "--comparison", str(FIXTURES / "comparison.json"),
                    "--output", str(output),
                ])
            self.assertEqual((status, stdout), (1, ""))
            self.assertIn("schema_version", stderr)
            self.assertFalse(output.exists())
            factory.assert_not_called()

    def test_validation_failure_writes_no_artifact_and_prints_no_success(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "invalid.json"
            with patch(
                "pravopisac_authoring.cli.ChatClient.from_env",
                return_value=StubClient(['{"approved":true}']),
            ):
                status, stdout, stderr = self.invoke([
                    "draft", "--brief", str(FIXTURES / "brief.json"),
                    "--comparison", str(FIXTURES / "comparison.json"),
                    "--output", str(output),
                ])
            self.assertEqual((status, stdout), (1, ""))
            self.assertIn("Validation failed", stderr)
            self.assertFalse(output.exists())

    def test_explicit_human_review_flag_is_required(self):
        with redirect_stderr(io.StringIO()):
            with self.assertRaises(SystemExit) as error:
                main([
                    "review", "--artifact", "unused.json", "--reviewer", "demo",
                    "--decision", "approved", "--note", "demo",
                    "--output", "unused-review.json",
                ])
        self.assertEqual(error.exception.code, 2)


class ClientTests(unittest.TestCase):
    def client(self):
        client = ChatClient(
            "https://models.example.invalid/v1/chat/completions",
            "synthetic-secret-never-log",
            "synthetic-generator",
            "synthetic-critic",
        )
        client.opener = Mock()
        return client

    def response(self, **overrides):
        result = {
            "id": "fixture-response",
            "model": "fixture-model-version",
            "choices": [{
                "finish_reason": "stop",
                "message": {"content": '{"schema_version":1}'},
            }],
        }
        result.update(overrides)
        return json.dumps(result).encode()

    def complete(self, client):
        return client.complete(model="requested", system="system", user="user")

    def test_request_format_and_returned_model_provenance(self):
        client = self.client()
        client.opener.open.return_value = io.BytesIO(self.response())
        result = self.complete(client)
        request = client.opener.open.call_args.args[0]
        body = json.loads(request.data)
        self.assertEqual(
            request.get_header("Authorization"), "Bearer synthetic-secret-never-log"
        )
        self.assertEqual(body["response_format"], {"type": "json_object"})
        self.assertEqual(len(body["messages"]), 2)
        self.assertNotIn("tools", body)
        self.assertEqual(result.provenance.requested_model, "requested")
        self.assertEqual(result.provenance.returned_model, "fixture-model-version")
        self.assertEqual(client.opener.open.call_args.kwargs["timeout"], 60)

    def test_endpoint_and_missing_configuration_errors(self):
        for url in (
            "http://example.invalid", "https://key@example.invalid",
            "https://example.invalid/?key=secret", "https://example.invalid/#secret",
        ):
            with self.subTest(url=url):
                with self.assertRaises(AuthoringError):
                    ChatClient(url, "key", "generator", "critic")
        with patch.dict("os.environ", {}, clear=True):
            with self.assertRaisesRegex(AuthoringError, "Missing environment"):
                ChatClient.from_env()

    def test_redirects_are_not_followed_with_authorization(self):
        client = ChatClient("https://example.invalid", "key", "generator", "critic")
        handler = next(
            item for item in client.opener.handlers
            if isinstance(item, HTTPRedirectHandler)
        )
        self.assertIsNone(handler.redirect_request(
            Request("https://example.invalid"), None, 302, "Moved", {},
            "https://different.example.invalid",
        ))

    def test_provider_failures_do_not_retry_or_expose_secrets(self):
        for error in (
            HTTPError("https://example.invalid", 401, "secret detail", {}, None),
            URLError("synthetic-secret-never-log"),
            TimeoutError("synthetic-secret-never-log"),
        ):
            client = self.client()
            client.opener.open.side_effect = error
            with self.assertRaises(AuthoringError) as caught:
                self.complete(client)
            self.assertNotIn("synthetic-secret-never-log", str(caught.exception))
            self.assertNotIn("secret detail", str(caught.exception))
            client.opener.open.assert_called_once()

    def test_truncated_refused_empty_and_malformed_responses_fail(self):
        cases = [
            b"not JSON",
            self.response(choices=[]),
            self.response(choices=[{
                "finish_reason": "length", "message": {"content": "{}"},
            }]),
            self.response(choices=[{
                "finish_reason": "stop",
                "message": {"content": None, "refusal": "Cannot comply"},
            }]),
            self.response(choices=[{
                "finish_reason": "stop", "message": {"content": "  "},
            }]),
        ]
        for body in cases:
            with self.subTest(body=body):
                client = self.client()
                client.opener.open.return_value = io.BytesIO(body)
                with self.assertRaises((ValidationError, AuthoringError)):
                    self.complete(client)
                client.opener.open.assert_called_once()


if __name__ == "__main__":
    unittest.main()

import unicodedata
from typing import Annotated, Literal

from pydantic import (
    AwareDatetime,
    BaseModel,
    ConfigDict,
    Field,
    StringConstraints,
    field_validator,
    model_validator,
)

Text = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]
Digest = Annotated[str, StringConstraints(pattern=r"^[0-9a-f]{64}$")]
SchemaVersion = Annotated[int, Field(strict=True, ge=1, le=1)]
ReviewDecision = Literal["approved", "rejected", "changes_requested"]


class Document(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True, frozen=True)


def normalized(text: str) -> str:
    return " ".join(unicodedata.normalize("NFKC", text).casefold().split())


class Question(Document):
    id: Text
    prompt: Text
    options: tuple[Text, Text]
    correct_index: Annotated[int, Field(alias="correctIndex", ge=0, le=1)]
    explanation: Text

    @model_validator(mode="after")
    def distinct_options(self) -> "Question":
        if normalized(self.options[0]) == normalized(self.options[1]):
            raise ValueError("Answer options must be distinct after normalization.")
        return self

    def fingerprint(self) -> tuple[str, tuple[str, ...]]:
        return normalized(self.prompt), tuple(sorted(map(normalized, self.options)))


class Reference(Document):
    id: Text
    title: Text
    edition: Text
    locator: Text
    excerpt: Text


class Brief(Document):
    schema_version: SchemaVersion
    content_kind: Literal["synthetic-demo", "educational-draft"]
    learner_group: Text
    topic: Text
    learning_objective: Text
    reviewer_id: Text
    brief_approved: bool
    source_sharing_approved: bool
    sources: Annotated[tuple[Reference, ...], Field(min_length=1)]

    @field_validator("brief_approved", "source_sharing_approved")
    @classmethod
    def require_explicit_permission(cls, value: bool) -> bool:
        if not value:
            raise ValueError("Explicit approval is required before a model call.")
        return value

    @model_validator(mode="after")
    def unique_sources(self) -> "Brief":
        ids = [source.id for source in self.sources]
        if len(ids) != len(set(ids)):
            raise ValueError("Reference IDs must be unique.")
        return self


class Evidence(Document):
    source_id: Text
    quote: Text
    reason: Text


class Draft(Document):
    schema_version: SchemaVersion
    question: Question
    evidence: Annotated[tuple[Evidence, ...], Field(min_length=1)]


class Finding(Document):
    concern: Text
    evidence: Annotated[tuple[Evidence, ...], Field(min_length=1)]


class Critique(Document):
    schema_version: SchemaVersion
    findings: tuple[Finding, ...]
    uncertainties: tuple[Text, ...]


class Comparison(Document):
    schema_version: SchemaVersion
    questions: tuple[Question, ...]

    @model_validator(mode="after")
    def unique_questions(self) -> "Comparison":
        seen_ids: set[str] = set()
        seen_questions: set[tuple[str, tuple[str, ...]]] = set()
        for question in self.questions:
            if question.id in seen_ids or question.fingerprint() in seen_questions:
                raise ValueError("The comparison set itself contains a duplicate.")
            seen_ids.add(question.id)
            seen_questions.add(question.fingerprint())
        return self


def check_evidence(evidence: tuple[Evidence, ...], brief: Brief) -> None:
    sources = {source.id: source for source in brief.sources}
    for item in evidence:
        source = sources.get(item.source_id)
        if source is None:
            raise ValueError(f"Unknown evidence source ID: {item.source_id}.")
        if item.quote not in source.excerpt:
            raise ValueError(
                f"Evidence quote is not present in source {item.source_id}."
            )


def check_duplicate(question: Question, comparison: Comparison) -> None:
    for existing in comparison.questions:
        if question.id == existing.id:
            raise ValueError("Question ID already exists in the comparison set.")
        if question.fingerprint() == existing.fingerprint():
            raise ValueError("Normalized question already exists in the comparison set.")


class ModelCall(Document):
    requested_model: Text
    returned_model: Text
    response_id: Text


class Artifact(Document):
    schema_version: SchemaVersion
    state: Literal["unreviewed"]
    created_at: AwareDatetime
    prompt_version: Literal["authoring-v1"]
    brief: Brief
    comparison: Comparison
    draft: Draft
    critique: Critique
    generator: ModelCall
    critic: ModelCall
    validation_checks: tuple[
        Literal["structure"],
        Literal["source_ids"],
        Literal["exact_quotes"],
        Literal["normalized_duplicates"],
    ]

    @model_validator(mode="after")
    def validate_context(self) -> "Artifact":
        check_evidence(self.draft.evidence, self.brief)
        check_duplicate(self.draft.question, self.comparison)
        for finding in self.critique.findings:
            check_evidence(finding.evidence, self.brief)
        return self


class HumanReview(Document):
    schema_version: SchemaVersion
    artifact_sha256: Digest
    reviewer_id: Text
    decision: ReviewDecision
    note: Text
    human_reviewed: bool
    reviewed_at: AwareDatetime

    @field_validator("human_reviewed")
    @classmethod
    def require_human_attestation(cls, value: bool) -> bool:
        if not value:
            raise ValueError("A human must explicitly attest to this review.")
        return value

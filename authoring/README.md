# Local authoring pilot

This Python/Pydantic command-line tool drafts **one unreviewed question**, checks
it, and requests a separate, advisory AI critique using the actual supplied
reference excerpts. It is an ordinary controlled program: no autonomous agents,
source retrieval, automatic revisions, or browser integration.

The generator must aim for correctness and the agreed learning objective. Local
checks establish structure, source IDs, exact quotation presence, and normalized
duplicates, **not linguistic correctness or grade alignment**. A quiet critic is
not proof of correctness; its objections may also be wrong.

## Setup and checks

Use Python 3.11 or newer; CI uses Python 3.13. From the repository root:

```sh
python3 -m venv .local-tools/authoring-venv
.local-tools/authoring-venv/bin/python -m pip install -e ./authoring
.local-tools/authoring-venv/bin/python -m unittest discover -s authoring/tests -v
```

Tests use synthetic fixtures and stubbed model responses, with no credentials or
external requests. They exercise the complete draft/critique/review path, including
rejection and stale approval. Automated review records in tests are not actual
human approvals.

## Required inputs

Keep local inputs and outputs under the ignored `.authoring/` directory. Do not
commit credentials, private material, unreviewed drafts, or personal learning
plans. The small JSON files in `tests/fixtures/` illustrate the data shapes only;
they are explicitly synthetic and are not suitable educational references.

Before a real run, agree:

- `learner_group`, `topic`, and `learning_objective`: the actual educational brief.
- `reviewer_id`: the human linguistic reviewer who will inspect the result.
- `sources`: approved excerpts, each with a unique `id`, `title`, `edition`,
  `locator`, and `excerpt`. Confirm these are suitable authoritative references
  and that sending the supplied text to the chosen provider is permitted.

The brief uses `schema_version: 1` and `content_kind: "educational-draft"` for real
drafts, or `"synthetic-demo"` for plumbing tests. `brief_approved: true` and
`source_sharing_approved: true` are required explicit operator attestations,
**not question approvals**. The tool does not choose a school year or approve
references on the user's behalf.

Every document requires integer `schema_version: 1`; booleans, strings, and
floating-point versions such as `1.0` are rejected rather than coerced.

The required comparison file has `schema_version: 1` and a `questions` array
using the existing browser fields: `id`, `prompt`, exactly two `options`,
`correctIndex` (integer 0 or 1), and `explanation`. An explicitly empty array is
allowed for the first pilot; it means there is no comparison coverage, not that
the question is globally unique. The tool rejects repeated IDs and normalized
prompt/options matches, including reordered options. It does not perform semantic
deduplication.

## Draft and critique

Choose an HTTPS provider endpoint implementing the Chat Completions JSON-object
response format. Set these environment variables through your local credential
management process:

| Variable | Required value |
| --- | --- |
| `PRAVOPISAC_API_URL` | Full HTTPS Chat Completions URL, without query, fragment, or embedded credentials |
| `PRAVOPISAC_API_KEY` | Provider credential; never a command-line argument or checked-in file |
| `PRAVOPISAC_GENERATOR_MODEL` | Explicit drafting model name |
| `PRAVOPISAC_CRITIC_MODEL` | Explicit critic model name; may be the same model |

No provider, model, or credential is selected automatically. The tool sends only
the brief's educational context and approved sources to the generator, then that
context and draft to the critic. It does not send the reviewer ID or comparison
collection. Requests have a 60-second timeout, do not follow redirects, and are
not automatically retried.

```sh
mkdir -p .authoring
.local-tools/authoring-venv/bin/python -m pravopisac_authoring draft \
  --brief .authoring/brief.json \
  --comparison .authoring/comparison.json \
  --output .authoring/run.json
```

There is at most one drafting call and one critique call per invocation. Invalid
drafts stop before critique. Malformed responses, unknown sources, fabricated
quotes, duplicate questions, refusals, and provider failures exit nonzero; no
successful artifact is emitted. Existing output files are never overwritten.

An artifact contains the brief and source excerpts, comparison set, draft and
quoted evidence, deterministic check results, advisory findings/uncertainties,
prompt version, timestamp, and requested/returned model names and response IDs.
It remains `unreviewed`, even when a separate human review is later recorded.
These files may contain reference material: treat them according to its license
and privacy requirements.

## Mandatory human review

The reviewer must inspect the actual sources, answer correctness, ambiguity of
both choices, explanation, learning objective, learner suitability, and critic
findings. A valid source ID or matching quote does not establish that the quote
supports the answer. Unsupported pedagogical concerns can appear as critic
uncertainties rather than cited findings.

Only **after actual human review**, record a decision in a separate file:

```sh
.local-tools/authoring-venv/bin/python -m pravopisac_authoring review \
  --artifact .authoring/run.json \
  --reviewer "<reviewer-id-from-brief>" \
  --decision approved \
  --note "<human review reasoning, including disposition of critic concerns>" \
  --human-reviewed \
  --output .authoring/review.json
```

Use `rejected` or `changes_requested` instead of `approved` when appropriate.
An unresolved or rejected pilot is a valid result. The tool does not edit or
automatically regenerate the question; a later attempt uses a new output file.

```sh
.local-tools/authoring-venv/bin/python -m pravopisac_authoring verify-review \
  --artifact .authoring/run.json \
  --review .authoring/review.json
```

Verification requires an approved decision by the brief's reviewer and a SHA-256
digest matching the entire canonical artifact, including its exact question,
sources, critique, and comparison context. Changed content requires fresh human
review; JSON whitespace/key ordering alone does not invalidate the digest.
Neither generation nor critique accepts a model-supplied approval field.

This is a trusted local workflow, not an authentication system: the flag and
reviewer ID record an operator's human-review attestation. They cannot prove a
person's identity, prevent deliberate local-file forgery, or establish correctness.
Do not automate the approval command as part of generation.

## Later direction, not part of this pilot

Evaluate the pilot with the reviewer before agreeing a collection size. The
intended path is LLM/agent-assisted drafts, deterministic checks, evidence-grounded
AI critique, **human review of every question**, and approved-only versioned data.
A future export/import gate must exclude pending, rejected, or stale approvals.
There is no exporter, app importer, review UI, deployment, or automatic revision
loop here. The static browser app continues using its synthetic demo cards and
never makes model requests.

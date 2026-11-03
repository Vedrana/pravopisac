# One-script question drafting

`draft_question.py` reads a learning brief and a human-reviewed rule brief, calls
one configured AI model, checks the question format, and saves a readable
Markdown draft for human review. The whole workflow is in that file, with comments
explaining each meaningful part.

There is no AI critic, approval command, review database, revision hash, comparison
collection, or run-tracking system. Humans review and correct the content in a
pull request. The script never approves questions or imports them into `web/`.

## Persisted rule briefs

[`rules/`](rules/README.md) defines the format for reusable, original rule
descriptions stored with their source URLs and section references. A rule starts
as an unreviewed draft. Corrections are made in that same file; after human
approval is recorded in pull request review, remove its "Unreviewed rule brief"
notice. That file now holds the final reviewed rule, not a separate approved copy.

The first human-reviewed and approved brief is
[`capitalization-personal-names.md`](rules/capitalization-personal-names.md).
Pass the chosen reviewed rule file directly through `--rule`; there is no need
to copy it into a separate reference file.

## Setup

Use Python 3.11 or newer; CI uses Python 3.13. From the repository root:

```sh
python3 -m venv .local-tools/authoring-venv
.local-tools/authoring-venv/bin/python -m pip install -r authoring/requirements.txt
```

Pydantic is the only dependency. It checks JSON field types and required values;
it is not an AI model.

## Inputs and model

Choose two UTF-8 input files:

- A learning brief, such as `.authoring/brief.txt` in the ignored scratch directory:
  the agreed learner group, topic, learning objective, and instructions.
- One human-reviewed file from [`rules/`](rules/README.md), including its rule,
  scope, conditions and exceptions, and source references.

The script requires nonempty files, but does not judge whether the brief is
educationally appropriate or verify the rule's approval. Confirm that the chosen
rule version has human approval and that the learning objective fits its scope
before generating real content. Only send material you are permitted to share
with the selected provider.

Configure these environment variables through your local credential-management
process; never put credentials in the repository or command arguments:

| Variable | Value |
| --- | --- |
| `PRAVOPISAC_API_URL` | Full HTTPS Chat Completions endpoint supporting JSON-object responses |
| `PRAVOPISAC_API_KEY` | Provider credential |
| `PRAVOPISAC_MODEL` | The single model to use |

No provider or model is selected automatically. URLs with embedded credentials,
queries, or fragments are rejected. Both input texts are sent in one request,
including the rule's source references, with a 60-second timeout, no redirects,
and no automatic retries. Source URLs are attribution only: the script does not
fetch them, and the model is instructed not to fetch them or claim to have read
them.

## Run and review

```sh
mkdir -p .authoring
.local-tools/authoring-venv/bin/python authoring/draft_question.py \
  --brief .authoring/brief.txt \
  --rule authoring/rules/capitalization-personal-names.md \
  --output .authoring/draft.md \
  --allow-input-sharing
```

The explicit sharing flag confirms that both files may go to the provider.
The model returns the five existing question fields: `id`, `prompt`, two
`options`, `correctIndex` (integer 0 or 1), and `explanation`. The script rejects
missing/blank fields, invalid answer indexes, indistinguishable options, and
unexpected fields such as a model-generated approval.

The model is instructed to use only the supplied rule as orthographic evidence,
respect its scope, exclusions, conditions, and exceptions throughout the question,
and refuse if the learning brief conflicts with the rule or the rule cannot
support a question. It must not infer additional rules or fill gaps with outside
knowledge. These are model instructions, not automated linguistic checks.

The output contains the proposed question and answer, explanation, original brief,
and the full supplied rule brief, including scope limits and source references.
Approval of the rule does **not** approve the generated question. Format checks
do not prove correctness, scope compliance, source support, uniqueness, or grade
alignment. These are human review tasks.
Provider errors, refusals, malformed responses, or invalid questions exit nonzero
without saving a draft. Existing output files are never overwritten.

A human linguistic reviewer must check both options, the explanation, compliance
with the rule's scope, source support, learner suitability, and duplicates.
Discuss and correct the proposed content through a pull request, and approve only
the final reviewed version.
Edits need review again. Do not publish unreviewed content or reference material
you cannot redistribute. The scratch draft itself stays local; when proposing
content in Git, include only shareable material needed for review.

There is still no app importer or publisher. The browser app keeps its synthetic
demo cards and makes no model calls.

## Checks and the previous interface

`--rule` replaces `--references`, and `--allow-input-sharing` replaces
`--allow-reference-sharing`. The old flags are no longer accepted.

```sh
.local-tools/authoring-venv/bin/python -m unittest discover -s authoring/tests -v
```

Tests use explicitly synthetic fixtures and mocked HTTP responses, without live
model calls or credentials. They do not establish educational correctness.

The previous packaged CLI and its `draft`, `review`, and `verify-review` commands
have been removed. Use this script and `PRAVOPISAC_MODEL` instead of the former
generator/critic model settings. Old artifact and approval JSON files are not
inputs to this workflow; human review now belongs in the pull request.

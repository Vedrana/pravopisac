# One-script question drafting

`draft_question.py` reads shared question guidelines, a question-specific learning
brief, and a human-reviewed rule brief, runs Copilot CLI with one chosen model,
checks the question format, and saves a readable
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

Use the [orthography coverage roadmap](orthography-coverage.md) to choose future
paraphrase batches and identify gaps beyond existing briefs. It groups remaining
scopes by recommended age and difficulty, with specialist reference material kept
separate. Update its covered scopes as briefs are added; the roadmap is not a
reviewed rule input and does not establish school-grade alignment.

## Setup

Use Python 3.11 or newer; CI uses Python 3.13. From the repository root:

```sh
python3 -m venv .local-tools/authoring-venv
.local-tools/authoring-venv/bin/python -m pip install -r authoring/requirements.txt
```

Pydantic is the only Python dependency. It checks JSON field types and required
values; it is not an AI model.

Install the current [GitHub Copilot CLI](https://docs.github.com/en/copilot/get-started/cli-quickstart),
then sign in once with the GitHub account that has your Copilot subscription:

```sh
copilot --version
copilot login
```

If the CLI is installed in this checkout's ignored `.local-tools/copilot/`
directory, first add it to the current terminal's search path:

```sh
export PATH="$PWD/.local-tools/copilot:$PATH"
```

No separate provider API key, HTTP endpoint, or web server is required. Copilot
stores its own sign-in credentials; do not copy them into the repository.

### Prevent additional charges

Generation consumes the same Copilot allowance as your other Copilot use.
Before a live run, set your **Bundled AI credits budget to $0** and enable
**Stop usage when budget limit is reached** in GitHub billing settings.
See [GitHub's billing guidance](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing).
If your organization pays, ask its billing administrator to confirm equivalent
spending controls. The script cannot inspect or enforce your account's budget,
and a failed or timed-out run may still consume usage.

## Inputs and model

Choose three UTF-8 input files:

- Shared [question guidelines](question-guidelines.md): the audience, wording,
  explanation standard, and human-review criteria. The initial profile is for
  beginning readers, not every primary-school reading level.
- A learning brief, such as `.authoring/brief.txt` in the ignored scratch directory:
  the learning objective, selected rule sub-scope, and example constraints.
  Keep personal learning plans and private exercises outside the repository.
- One human-reviewed file from [`rules/`](rules/README.md), including its rule,
  scope, conditions and exceptions, and source references.

The script requires all three files explicitly; `--guidelines` has no implicit
default. It checks that files are nonempty, but does not judge whether the brief is
educationally appropriate or verify the rule's approval. Confirm that the chosen
rule version has human approval and that the learning objective fits its scope
before generating real content. Only send material you are permitted to share
through GitHub Copilot.

For example, a question-specific brief for the existing personal-name rule could
contain:

```text
Learning objective: Recognize that a person's single-word given name starts
with a capital letter even when it is not the first word of the sentence.

Example constraints: Use one fictional person's single-word given name in a
short sentence, away from the sentence start. The two options must be identical
except for the initial capitalization of that name. Do not test surnames or a
second spelling distinction.

Draft one unreviewed question, not approved learning content.
```

The shared guidelines supply the reading level and explanation requirements;
the brief need not repeat them. Agree on a different guidelines profile before
targeting a different reading level.

Select the model explicitly in the current terminal, for example:

```sh
export PRAVOPISAC_MODEL=gpt-6.1-sol
```

Use a model available to your signed-in account; the script never selects one
automatically or switches to another on failure. `PRAVOPISAC_API_URL` and
`PRAVOPISAC_API_KEY` are no longer used. A set `COPILOT_PROVIDER_BASE_URL` is
rejected so that an inherited custom-provider endpoint does not replace Copilot
subscription access.

Each run starts one new, non-interactive CLI session with a 120-second timeout.
All three input texts, including the rule's source references, go through standard
input, not command arguments. The CLI runs in an empty temporary directory with
no available tools, no built-in MCP servers, no repository custom instructions,
no automatic CLI updates, and client telemetry disabled. The script disables
inherited `COPILOT_ALLOW_ALL` so it cannot opt this directory into trusted hooks.
It does not retry, resume earlier conversations, or grant blanket permissions.
Source URLs are attribution only: the model has no tools to fetch them and is
instructed not to claim to have read them. Copilot can retain its own session
history and logs under its normal settings.

## Run and review

```sh
mkdir -p .authoring authoring/questions
.local-tools/authoring-venv/bin/python authoring/draft_question.py \
  --brief .authoring/brief.txt \
  --guidelines authoring/question-guidelines.md \
  --rule authoring/rules/capitalization-personal-names.md \
  --output authoring/questions/draft.md \
  --allow-input-sharing
```

The explicit sharing flag confirms that all three files may go through
GitHub Copilot.
The model returns the five existing question fields: `id`, `prompt`, two
`options`, `correctIndex` (integer 0 or 1), and `explanation`. The script rejects
missing/blank fields, invalid answer indexes, options identical after spacing and
Unicode normalization, and unexpected fields such as a model-generated approval.
Capitalization differences are preserved: a capitalization exercise needs to
allow two options that differ only in letter case.

The model is instructed to use only the supplied rule as orthographic evidence,
respect its scope, exclusions, conditions, and exceptions throughout the question,
and refuse if the learning brief conflicts with the rule or the rule cannot
support a question. It must not infer additional rules or fill gaps with outside
knowledge. These are model instructions, not automated linguistic checks.
Shared guidelines govern audience and style; the question-specific brief supplies
the objective and example constraints, not an override of those guidelines.
The model is instructed to refuse if the guidelines and brief conflict.
Repository custom instructions are disabled, so guidance saved only in
`.github/copilot-instructions.md` is not supplied to this generator.

The output contains the proposed question and answer, explanation, shared
guidelines, original question-specific brief, and the full supplied rule brief,
including scope limits and source references.
Approval of the rule does **not** approve the generated question. Format checks
do not prove correctness, scope compliance, source support, uniqueness, or grade
alignment. These are human review tasks.
CLI errors, refusals, malformed responses, or invalid questions exit nonzero
without saving a draft. The response must be a plain JSON object; prose and
Markdown fences are rejected, not silently repaired or retried. Existing output
files are never overwritten.

To generate another draft, run the same command with a new `--output` path, such
as `authoring/questions/draft-2.md`. This makes generation repeatable, not deterministic:
the same inputs and model can produce different wording.

If the command fails because Copilot is unavailable, check `copilot --version`,
run `copilot login` if needed, and confirm the model and remaining allowance in
Copilot. Raw CLI diagnostics are not printed by the script, to avoid exposing
private output. Resolve the cause before explicitly running it again.

A human linguistic reviewer must check both options, the explanation, compliance
with the rule's scope, source support, learner suitability, explanation readability
against the supplied guidelines, and duplicates.
Commit shareable drafts under `authoring/questions/` so reviewers can comment on
the generated sentences directly. If a draft was saved in ignored `.authoring/`,
copy its shareable content into that tracked directory first; keep private or
temporary material local. The first live-generated example is
[`questions/personal-name-question-1.md`](questions/personal-name-question-1.md).

Make requested corrections in that same tracked file. It remains unreviewed until
a human explicitly approves the final content in a pull request review or comment.
Then replace its unreviewed notice with an approval note and link to that approval.
Approval of the final file approves its question; there is no separate approved
copy or approval system. Later content edits need review again. Do not publish
unreviewed questions in the app or commit material you cannot redistribute.

There is no automated app importer or publisher. The first approved question has
been copied unchanged into [`web/src/questions.ts`](../web/src/questions.ts) with
its authoring-file reference and human-approval link. The browser app shows it
first, alongside three clearly marked synthetic demo cards, and makes no model
calls. Publishing another question requires recorded human approval followed by
a manual addition to the app data; later content edits need review again.

## Checks and the previous interface

`--rule` replaces `--references`, and `--allow-input-sharing` replaces
`--allow-reference-sharing`. The old flags are no longer accepted.
New runs also require `--guidelines`. Previously reviewed questions retain their
original inputs and approval; do not rewrite their historical generation briefs.

```sh
.local-tools/authoring-venv/bin/python -m unittest discover -s authoring/tests -v
```

Tests use explicitly synthetic fixtures and mocked CLI processes, without live
model calls, an installed Copilot CLI, or credentials. They do not establish
educational correctness.

The previous packaged CLI and its `draft`, `review`, and `verify-review` commands
have been removed. Use this script and `PRAVOPISAC_MODEL` instead of the former
generator/critic model settings. Old artifact and approval JSON files are not
inputs to this workflow; human review now belongs in the pull request.

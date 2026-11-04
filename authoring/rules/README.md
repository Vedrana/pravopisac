# Rule briefs

Store reusable, original descriptions of orthography rules here, with their
source references in the same Markdown file. Keep them separate from a
learner-specific brief and from generated questions.

[`capitalization-personal-names.md`](capitalization-personal-names.md) is the
first human-reviewed and approved rule brief. This README defines the shared
format and review process.

## Draft batch for earlier primary-school writing

The following 18 briefs implement the scope agreed in
[issue #9](https://github.com/Vedrana/pravopisac/issues/9). They are
**unreviewed drafts**, not approved inputs for question generation.
The intended audience does not establish verified school-grade alignment.
The existing approved personal-name brief is unchanged.

| Area | Draft briefs |
| --- | --- |
| Capitalization | [Sentence start](capitalization-sentence-start.md), [single-word animal names](capitalization-animal-names.md) |
| Settlement names | [Single-word](capitalization-single-word-settlement-names.md), [multiword](capitalization-multiword-settlement-names.md) |
| Country names | [Single-word](capitalization-single-word-country-names.md), [multiword](capitalization-multiword-country-names.md) |
| Other names and titles | [Streets](capitalization-street-names.md), [squares](capitalization-square-names.md), [holidays](capitalization-holiday-names.md), [books](capitalization-book-titles.md) |
| Sentence endings | [Full stop](punctuation-statement-full-stop.md), [question mark](punctuation-direct-question-mark.md), [exclamation mark](punctuation-exclamation-mark.md) |
| Lists and spacing | [Commas](punctuation-simple-list-commas.md), [colon](punctuation-simple-list-colon.md), [basic punctuation spacing](punctuation-basic-spacing.md) |
| Separate word writing | [Ne with verbs](word-separation-ne-verbs.md), [question particle li](word-separation-question-particle-li.md) |

This batch excludes č/ć, dž/đ, and ije/je. Each brief states its own narrower
scope and exclusions; do not infer missing rules from it. Approval of the
batch scope is not linguistic approval of these files. Each needs the human
review described below before generation. No questions or app content are
added by this batch.

## One file per rule

Use a descriptive kebab-case filename. Its basename is the stable rule ID:
`capitalization-personal-names.md` would have ID `capitalization-personal-names`.
Do not reuse an ID for a different rule. Git preserves revisions; cite the rule
ID and the Git commit when reviewing questions generated from it.

Each rule file starts with this draft structure. After human review and approval,
remove the "Unreviewed rule brief" notice below. The same file then holds the
final reviewed rule; do not create a separate approved copy.

```markdown
# Rule title

Unreviewed rule brief. Human linguistic review is required before generation.

## Rule

An original description of the rule, preserving its relevant meaning.

## Scope

What this brief covers and what it deliberately excludes.

## Conditions and exceptions

Conditions needed to apply the rule correctly and relevant exceptions.
If none apply within the stated scope, say so explicitly.

## Sources

- Source title and publisher.
- Original rule URL and exact section or paragraph.
- Edition or version, when the source identifies one.
```

The placeholders above are a writing template, not a rule or a model input.
Write the actual rule description in Croatian. Keep source details with that
description, not only in a pull request or a local scratch file.

## Review and use

A human linguistic reviewer must compare the original description with the
cited sources, checking meaning, conditions, exceptions, and omissions. An
intentional scope limit must not turn into a misleading general rule.

Make review corrections directly in the rule file. Keep its "Unreviewed rule
brief" notice until human approval is recorded in pull request review, then
remove the notice. The final paraphrased rule remains in the same file's
`## Rule` section, with the original source reference in `## Sources`.

Use the approved version as input to question generation with
`draft_question.py --rule path/to/rule.md` (alongside the learning brief, output
path, and sharing confirmation described in the [authoring guide](../README.md)).
Removing the notice alone does not establish approval. If the rule changes later,
restore the notice and obtain fresh review before using the changed version.
Generated questions require their own human review against the rule and source.

Write original descriptions of the underlying rules, not copied or closely
paraphrased handbook prose. Rephrasing alone does not establish permission to
reuse source material. Store and send only material whose use is permitted.

The script sends the full supplied rule brief to the configured model and
includes it in the question draft. It instructs the model to stay within the
rule's scope and not infer additional rules or fetch linked sources. The script
does not verify approval or linguistic correctness, fetch sources, or publish
questions to the app.

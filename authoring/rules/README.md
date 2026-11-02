# Rule briefs

Store reusable, original descriptions of orthography rules here, with their
source references in the same Markdown file. Keep them separate from a
learner-specific brief and from generated questions.

[`capitalization-personal-names.md`](capitalization-personal-names.md) is the
first human-reviewed and approved rule brief. This README defines the shared
format and review process.

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

The approved version can be used as input to question generation once the
script supports rule briefs. Removing the notice alone does not establish
approval. If the rule changes later, restore the notice and obtain fresh review
before using the changed version. Generated questions require their own human
review against the rule and source.

Write original descriptions of the underlying rules, not copied or closely
paraphrased handbook prose. Rephrasing alone does not establish permission to
reuse source material. Store and send only material whose use is permitted.

The existing script can read Markdown as UTF-8 text through `--references`,
but its model instructions currently expect reference excerpts. Adapting those
instructions to these rule briefs is a separate step. This directory adds no
automatic source fetching, generation, approval, or app publication.

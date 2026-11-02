# Rule briefs

Store reusable, original descriptions of orthography rules here, with their
source references in the same Markdown file. Keep them separate from a
learner-specific brief and from generated questions.

**There are no reviewed rule briefs in this directory yet.** This document
defines their format, not reviewed educational content.

## One file per rule

Use a descriptive kebab-case filename. Its basename is the stable rule ID:
`capitalization-personal-names.md` would have ID `capitalization-personal-names`.
Do not reuse an ID for a different rule. Git preserves revisions; cite the rule
ID and the Git commit when reviewing questions generated from it.

Each rule file must follow this structure:

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

Keep draft briefs explicitly unreviewed. Approval belongs in pull request
review of the final version; a file's existence or removal of its draft notice
does not establish approval. Changes need fresh review before generation.
Generated questions require their own human review against the rule and source.

Write original descriptions of the underlying rules, not copied or closely
paraphrased handbook prose. Rephrasing alone does not establish permission to
reuse source material. Store and send only material whose use is permitted.

The existing script can read Markdown as UTF-8 text through `--references`,
but its model instructions currently expect reference excerpts. Adapting those
instructions to these rule briefs is a separate step. This directory adds no
automatic source fetching, generation, approval, or app publication.

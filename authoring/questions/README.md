# Questions for human review

The 9 November 2026 batch contains **57 new, unreviewed questions**: three for
each of the 19 human-approved [rule briefs](../rules/README.md). These are
shareable product drafts, not demo fixtures or approved learning content.
Approval of an input rule does not approve any question.

Each linked file contains one proposed question, two options, a proposed answer,
an explanation, its question-specific brief, and full snapshots of the supplied
[guidelines](../question-guidelines.md) and rule, including source references and
the rule's human-approval link. The input revision is
`830a11ba1b5d527544baa5968f1b4ec54d38e8df`.

The questions were drafted in the GitHub Copilot app with `gpt-6.1-sol`.
The existing `Question` schema and `render_draft` function in
[`draft_question.py`](../draft_question.py) checked their format and rendered the
review files; this batch did not invoke the standalone Copilot CLI generator.
Format checks do not establish linguistic correctness, source support, or
learner suitability.

## New drafts

| Approved input rule | Question 1 | Question 2 | Question 3 |
| --- | --- | --- | --- |
| [Personal names](../rules/capitalization-personal-names.md) | [01](capitalization-personal-names-01.md) | [02](capitalization-personal-names-02.md) | [03](capitalization-personal-names-03.md) |
| [Sentence start](../rules/capitalization-sentence-start.md) | [01](capitalization-sentence-start-01.md) | [02](capitalization-sentence-start-02.md) | [03](capitalization-sentence-start-03.md) |
| [Animal names](../rules/capitalization-animal-names.md) | [01](capitalization-animal-names-01.md) | [02](capitalization-animal-names-02.md) | [03](capitalization-animal-names-03.md) |
| [Single-word settlement names](../rules/capitalization-single-word-settlement-names.md) | [01](capitalization-single-word-settlement-names-01.md) | [02](capitalization-single-word-settlement-names-02.md) | [03](capitalization-single-word-settlement-names-03.md) |
| [Multiword settlement names](../rules/capitalization-multiword-settlement-names.md) | [01](capitalization-multiword-settlement-names-01.md) | [02](capitalization-multiword-settlement-names-02.md) | [03](capitalization-multiword-settlement-names-03.md) |
| [Single-word country names](../rules/capitalization-single-word-country-names.md) | [01](capitalization-single-word-country-names-01.md) | [02](capitalization-single-word-country-names-02.md) | [03](capitalization-single-word-country-names-03.md) |
| [Multiword country names](../rules/capitalization-multiword-country-names.md) | [01](capitalization-multiword-country-names-01.md) | [02](capitalization-multiword-country-names-02.md) | [03](capitalization-multiword-country-names-03.md) |
| [Street names](../rules/capitalization-street-names.md) | [01](capitalization-street-names-01.md) | [02](capitalization-street-names-02.md) | [03](capitalization-street-names-03.md) |
| [Square names](../rules/capitalization-square-names.md) | [01](capitalization-square-names-01.md) | [02](capitalization-square-names-02.md) | [03](capitalization-square-names-03.md) |
| [Holiday names](../rules/capitalization-holiday-names.md) | [01](capitalization-holiday-names-01.md) | [02](capitalization-holiday-names-02.md) | [03](capitalization-holiday-names-03.md) |
| [Book titles](../rules/capitalization-book-titles.md) | [01](capitalization-book-titles-01.md) | [02](capitalization-book-titles-02.md) | [03](capitalization-book-titles-03.md) |
| [Statement full stop](../rules/punctuation-statement-full-stop.md) | [01](punctuation-statement-full-stop-01.md) | [02](punctuation-statement-full-stop-02.md) | [03](punctuation-statement-full-stop-03.md) |
| [Direct-question mark](../rules/punctuation-direct-question-mark.md) | [01](punctuation-direct-question-mark-01.md) | [02](punctuation-direct-question-mark-02.md) | [03](punctuation-direct-question-mark-03.md) |
| [Exclamation mark](../rules/punctuation-exclamation-mark.md) | [01](punctuation-exclamation-mark-01.md) | [02](punctuation-exclamation-mark-02.md) | [03](punctuation-exclamation-mark-03.md) |
| [Simple-list commas](../rules/punctuation-simple-list-commas.md) | [01](punctuation-simple-list-commas-01.md) | [02](punctuation-simple-list-commas-02.md) | [03](punctuation-simple-list-commas-03.md) |
| [Simple-list colon](../rules/punctuation-simple-list-colon.md) | [01](punctuation-simple-list-colon-01.md) | [02](punctuation-simple-list-colon-02.md) | [03](punctuation-simple-list-colon-03.md) |
| [Basic punctuation spacing](../rules/punctuation-basic-spacing.md) | [01](punctuation-basic-spacing-01.md) | [02](punctuation-basic-spacing-02.md) | [03](punctuation-basic-spacing-03.md) |
| [Ne with verbs](../rules/word-separation-ne-verbs.md) | [01](word-separation-ne-verbs-01.md) | [02](word-separation-ne-verbs-02.md) | [03](word-separation-ne-verbs-03.md) |
| [Question particle li](../rules/word-separation-question-particle-li.md) | [01](word-separation-question-particle-li-01.md) | [02](word-separation-question-particle-li-02.md) | [03](word-separation-question-particle-li-03.md) |

## Review and existing approved content

Review and correct each question in its own file. Check both options, the answer
key, the explanation, compliance with the rule and its sources, duplicates,
learner suitability, and explanation readability. Approval must be explicit in
a human pull request review or comment; then replace that question's unreviewed
notice with an approval note and link. Later content changes require fresh
review. No school-grade alignment is claimed.

The existing [approved personal-name question](personal-name-question-1.md)
is unchanged and is not one of the 57 new drafts. Nothing in this batch has
been imported into the browser app.

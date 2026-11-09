# Unreviewed question draft

Only basic format checks have passed. A human must check correctness, both options,
the explanation, and suitability against the supplied rule and its sources.
Approval of the rule does not approve this question.

Drafted in the GitHub Copilot app with `gpt-6.1-sol` on 9 November 2026. Format-checked and rendered with `Question` and `render_draft` from `authoring/draft_question.py`; this batch did not invoke the standalone Copilot CLI generator.

Rule ID: `capitalization-animal-names`. Rule file: [`capitalization-animal-names.md`](../rules/capitalization-animal-names.md).
Rule and guidelines input revision: `830a11ba1b5d527544baa5968f1b4ec54d38e8df`. The supplied inputs are preserved below.

## Proposed question

```text
ID: capitalization-animal-names-02

Koja je rečenica o mački pravilno napisana?

A: Mačka mica prede.
B: Mačka Mica prede.

Proposed correct answer: B

Explanation: Mica je ime mačke pa počinje velikim slovom.
```

## Supplied question guidelines

```text
# Shared question guidelines

Use these guidelines alongside one human-approved rule brief and a
question-specific learning brief. They define the initial authoring standard
for beginning readers; they are not orthographic evidence, approval of generated
content, or verified school-grade alignment.

## Audience

Write for children who can independently read a short Croatian sentence and
are beginning to learn explicit spelling rules. "Primary-school aged" alone is
not a sufficient reading-level description.

Use familiar, concrete vocabulary and everyday situations. Do not assume
knowledge of specialist terms, geography, or cultural facts to choose an answer.
If the rule requires a name or title, provide enough context to identify what
it names without relying on that outside knowledge.

## Prompt and answer options

- Write all child-facing text in Croatian.
- Ask one clear question about one distinction supported by the supplied rule.
- Keep sentences short and direct. Avoid unnecessary detail, trick questions,
  and confusing negative instructions.
- Provide exactly two options with exactly one correct answer. Keep options
  alike except for the targeted spelling distinction wherever possible.
- Make the incorrect option wrong for the intended reason, not because of an
  unrelated mistake. Check the entire text of both options.
- Stay within the rule's scope, conditions, exceptions, and exclusions.
  A question-specific brief may narrow that scope, never extend it.
- Do not rely on color, visual position, or a previous question to communicate
  meaning. The wording must work when the question is read on its own.

## Explanation

- Aim for one or two short sentences. This is a readability target, not a hard
  limit: preserve information needed to explain the answer accurately.
- Say why the correct option is correct, connecting the supplied rule to the
  actual word or punctuation mark in this example.
- Name the relevant word or mark rather than referring only to "answer A" or
  "the green answer". Do not merely repeat the correct option.
- Prefer familiar wording. Use a grammatical term only when needed, and explain
  an unfamiliar term in simple words.
- Do not just say "That is the rule", praise the child, or judge their ability.
  Use calm, neutral wording that is useful after either answer.
- Do not turn a narrow rule into a false universal statement. Include a relevant
  condition when leaving it out would mislead; do not recite unrelated exceptions.
- Write original examples and explanations. Do not copy handbook examples or
  source prose. Source attribution does not grant permission to reproduce it.

## Reviewed wording reference

The existing [approved personal-name question](questions/personal-name-question-1.md)
provides a concrete style reference:

> Ana je osobno ime pa počinje velikim slovom i kad nije na početku rečenice.

This explanation identifies the word, gives the reason, and addresses the
distinction shown in the options. Its approval applies to that question only;
it does not approve these guidelines or future generated explanations.

## Human review

Review the prompt, both options, correct answer, and explanation together.
Check that:

- Exactly one option is correct under the supplied rule and its sources.
- The question tests only the intended distinction and stays within scope.
- A reader at the stated level can understand the vocabulary and task without
  needing unrelated knowledge.
- The explanation is easy to read and explains this answer without misleading
  generalization. Read it aloud as a practical wording check.
- The question does not duplicate an existing example without a useful new
  learning purpose.

Learner suitability means that a child at the stated reading level can understand
the task, options, and explanation, and that the question supports the stated
learning objective without requiring unrelated knowledge. A human reviewer must
assess the actual question against these criteria; neither a test fixture nor
the generator's format checks establish suitability.

Correct and human-approve each tracked question using the existing pull request
process. Record approval of learner suitability alongside linguistic correctness
in the question's tracked file, with a link to the approving review or comment.
This records a human judgment, not verified school-grade alignment or a guarantee
that every child will understand the question.
Keep the original guidelines, brief, and rule text in the draft so reviewers can
see what was supplied. Later edits to approved question content need fresh review.

## Question-specific brief

Keep the brief focused on the learning objective, the selected part of the rule,
and constraints on this example. Do not duplicate or weaken the shared guidelines.
If the objective needs a different reading level, agree and supply a suitable
guidelines file rather than silently overriding this audience in the brief.

Keep personal learning plans and private exercises outside the repository.
Only shareable product content and instructions belong in tracked review files.
```

## Question-specific brief

```text
Learning objective: Recognize the capital initial of a cat's single-word name, Mica, inside a sentence. Keep the species word and all other spelling unchanged.

Example constraints: Draft one original Croatian two-choice question about only this distinction. Keep the options identical apart from the targeted capitalization, punctuation, or word boundary. Follow the supplied beginning-reader guidelines and the rule's scope, exclusions, and conditions. Use the context described above; do not require outside facts to choose the answer.

Question ID: capitalization-animal-names-02
Draft one unreviewed question, not approved learning content.
```

## Supplied rule brief

```text
# Veliko početno slovo u jednorječnim imenima životinja

Reviewed and approved by a human.
Approval recorded in [pull request #10](https://github.com/Vedrana/pravopisac/pull/10#pullrequestreview-5815187748).

## Rule

Jednorječno ime kojim nazivamo određenu životinju započinjemo velikim
slovom. Naziv vrste životinje nije njezino osobno ime i ne dobiva veliko
početno slovo samo zato što označuje tu životinju.

## Scope

Opis obuhvaća jednorječna vlastita imena pojedinačnih životinja,
stvarnih ili izmišljenih, u doslovnoj uporabi. Ne obuhvaća višerječna
imena, nazive pasmina, znanstveno nazivlje, množinske oblike ni prenesenu
uporabu imena.

## Conditions and exceptions

Iz konteksta mora biti jasno je li riječ ime životinje ili opći naziv.
Ako opći naziv stoji na početku rečenice, njegovo se početno slovo
određuje zasebnim pravilom o početku rečenice.

Za jednorječna imena u ovome opsegu izvor ne navodi iznimku.
Pravilo se ne smije širiti na svaku riječ kojom se životinja opisuje.

## Sources

- Hrvatski pravopis, Institut za hrvatski jezik i jezikoslovlje, mrežno izdanje.
- https://pravopis.hr/pravilo/imena-zivotinja/97/
- Odjeljak 4.1.2.2. „Imena životinja”, pravilo o velikome početnom slovu
  u imenima životinja; ovdje ograničeno na jednorječna imena.
- Datum pristupa: 4. studenoga 2026. Stranica ne navodi oznaku verzije
  ni datum izmjene.

Opis je napisan samostalno; izvorni tekst i popisi primjera nisu preuzeti.
Navođenje izvora nije dopuštenje za preuzimanje ili slanje njegova teksta
pružatelju modela.
```

## Human review

Use pull request review to discuss, correct, and approve the content.
Check learner suitability and explanation readability against the supplied
guidelines as well as correctness against the rule and its sources.
Changes to the question need review again. This file is not an approval
and nothing has been imported into the app.

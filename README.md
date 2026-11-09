# Pravopisac

A browser-based Croatian orthography learning app, starting with flash cards and
eventually growing into a character-based game.

**Current delivery: one approved question.** The card
practises personal-name capitalization using the
[human-approved question](authoring/questions/personal-name-question-1.md).
No placeholder demo cards are included. No school-grade alignment is claimed.

## Run locally

Use Node.js 24 (the pinned version is in `web/.node-version`) and npm.

```sh
cd web
npm ci
npm run dev
```

Open the local URL printed by Vite. The interface supports touch and keyboard
input, answer feedback, a completion score, and restart. Progress is held in
memory: refreshing the page starts a new session.

## Checks

Run from `web/`:

```sh
npm run lint
npm test
npm run build
```

The GitHub Actions workflow runs the same checks on pull requests and pushes to
`main`. It does not deploy the app.

## Architecture

- `web/src/questions.ts`: checked-in question data and its TypeScript contract.
  Questions carry their authoring file and human-approval link; only approved
  questions are included.
- `web/src/App.tsx`: React presentation and the in-memory quiz session. Feedback,
  progress, and score are derived from the recorded answers.
- `web/src/App.test.tsx`: interaction coverage for correct/wrong answers, locked
  choices, progression, restart, keyboard navigation, and content-status labels.
- `web/src/questions.test.ts`: checks that the app copy matches the tracked approved
  question, retains its approval link, and includes only approved questions.

React and TypeScript provide a conventional component-based foundation; Vite
produces static files in `web/dist/`. Relative asset paths allow hosting under a
GitHub Pages project path without adding routing or a server.

There is no backend, account system, runtime model call, telemetry, or API key in
the app. TypeScript checks the source data at build time; it does not validate
external JSON.

## Local question-authoring pilot

[`authoring/draft_question.py`](authoring/draft_question.py) is one separate Python script:
read a learning brief and a human-reviewed rule brief, run Copilot CLI with one
chosen model using your existing Copilot sign-in, check the question format,
and save a readable draft with its inputs. No separate provider API key is needed;
generation consumes your Copilot usage allowance. Human
linguistic review and approval happen through an ordinary pull request, not an
AI critic or approval subsystem.

Shareable generated drafts are tracked in [`authoring/questions/`](authoring/questions/)
for line-by-line review. Human approval of the final file approves its question;
later content changes need review again.

Format checks do not prove correctness or source support. The learner group,
topic, reviewed rule, and permission to share the input texts must be agreed
before real generation. Checked-in fixtures are synthetic tests, not learning content.
There is no automated app importer or publisher. The first approved question has
been copied unchanged into `web/src/questions.ts` with its approval link.
Future questions require recorded human approval before a
manual addition to the app data; later content edits need review again. The app
still makes no runtime AI calls. See the [authoring guide](authoring/README.md) for
setup and usage.

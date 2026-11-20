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
`main`. Deployment is separate: `.github/workflows/deploy.yml` publishes to GitHub
Pages only for `v*` tags or a manual run.

`npm run generate` (run automatically before `dev`, `build`, and `test`) reads
`authoring/questions/` and writes the git-ignored `web/src/questions.generated.ts`.
It fails if a question file lacks recorded human approval or does not match the
expected format. Run it again after changing an authoring file.

## Architecture

- `web/src/questions.ts`: the question TypeScript contract and the question list,
  generated from `authoring/questions/` by `web/scripts/`. Questions carry their
  authoring file and human-approval link; only files recording human approval
  are included.
- `web/src/App.tsx`: React presentation and the in-memory quiz session. Questions
  are shuffled at the start of each session and on restart. Feedback, progress,
  and score are derived from the recorded answers.
- `web/src/App.test.tsx`: interaction coverage for correct/wrong answers, locked
  choices, progression, shuffling, restart, and keyboard navigation.
- `web/src/questions.test.ts`: checks that the app includes every tracked authoring
  question exactly once, matches its file, and retains its approval link.

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
There is no publisher. `npm run generate` in `web/` builds the app's question
list from every file in `authoring/questions/`, keeping each file reference and
human-approval link, and fails for a file without recorded approval. Adding a
question to the app therefore means adding an approved file; later content edits
need review again. The app still makes no runtime AI calls. See the
[authoring guide](authoring/README.md) for setup and usage.

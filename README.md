# Pravopisac

A browser-based Croatian orthography learning app, starting with flash cards and
eventually growing into a character-based game.

**Current delivery: interface demo only.** The three cards contain clearly marked
placeholder data, not reviewed Croatian exercises or grade-aligned learning
content. Real content requires a chosen learner group, topic, and human review.

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

- `web/src/questions.ts`: checked-in demo data and its TypeScript contract.
- `web/src/App.tsx`: React presentation and the in-memory quiz session. Feedback,
  progress, and score are derived from the recorded answers.
- `web/src/App.test.tsx`: interaction coverage for correct/wrong answers, locked
  choices, progression, restart, and keyboard navigation.

React and TypeScript provide a conventional component-based foundation; Vite
produces static files in `web/dist/`. Relative asset paths allow hosting under a
GitHub Pages project path without adding routing or a server.

There is no backend, account system, runtime model call, telemetry, or API key in
the app. TypeScript checks the source data at build time; it does not validate
external JSON.

## Local question-authoring pilot

[`authoring/`](authoring/README.md) is a separate Python/Pydantic tool for drafting
one question from explicitly supplied reference excerpts. It validates structure,
source links, exact quotations, and normalized duplicates, then makes a separate
reference-grounded advisory critique call. Human review is recorded separately
and bound to the exact artifact revision; neither model can approve content.

The tool requires an approved learner/topic brief, reference-sharing permission,
a reviewer, and explicit model configuration. Its checked-in fixtures are
synthetic tests, not Croatian learning content. The pilot has no app importer or
publisher: `web/` still uses only its three demo cards, with no runtime AI.

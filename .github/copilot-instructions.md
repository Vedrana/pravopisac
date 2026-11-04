# Pravopisac product context

- The browser application is in `web/`: React, TypeScript, Vite, and npm.
- Use Node 24, matching `web/.node-version`. Preserve `web/package-lock.json`;
  use `npm ci` for an unchanged dependency manifest.
- If `.local-tools/node/bin/node` exists, prepend `.local-tools/node/bin` to PATH
  from the repository root. This ignored runtime is local tooling, not source.
- Run `npm run lint`, `npm test`, and `npm run build` from `web/` for app changes.
- Keep educational question data separate from its presentation so it can later
  be reused by a game.
- Keep demo fixtures explicitly labeled. Only present a question as approved
  Croatian content when its tracked authoring file records human approval;
  retain that file reference and approval link in app data. Do not claim grade
  alignment.
- Keep child-facing UI text Croatian, touch-friendly, and keyboard accessible.
  Feedback must not rely on color alone.
- The app is static: no runtime model requests, credentials, accounts, telemetry,
  or backend without an explicit architecture decision.
- Scope one reviewable delivery at a time. Do not add game mechanics,
  persistence, or deployment without agreement.
- Keep personal learning plans and exercises outside the repository.
- Do not upgrade unrelated system packages to prepare the development environment.

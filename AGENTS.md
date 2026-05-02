# Agent Instructions

## Scope
- Root `package.json` is the only app package.
- Ignore nested `package.json`, `README*`, and workflows under `.opencode/`; they belong to local OpenCode skills, not this NestJS app.
- App entrypoint is `src/main.ts`; module wiring starts in `src/app.module.ts`.
- Unit tests live in `src/*.spec.ts`. E2E tests live in `test/*.e2e-spec.ts` and run through `test/jest-e2e.json`.

## Environment
- Use Node.js 22 and `npm`.
- Only verified env var is `PORT`; start from `.env.example` if a local `.env` is needed.

## Commands
- Install: `npm install`
- Dev server: `npm run start:dev`
- Build: `npm run build`
- Production start: `npm run start:prod`
- Docker dev: `npm run docker:dev`
- Docker down: `npm run docker:down`

## Focused Verification
| Task | Command |
|---|---|
| Lint one file without auto-fixing | `npx eslint src/app.controller.ts` |
| Unit test one file | `npm test -- --runTestsByPath src/app.controller.spec.ts` |
| E2E test one file | `npm run test:e2e -- test/app.e2e-spec.ts` |
| Typecheck (full project only) | `npx tsc --noEmit -p tsconfig.json` |

## Gotchas
- `npm run lint` uses `--fix`; it will modify files.
- `npm run build` uses Nest CLI with `deleteOutDir`, so `dist/` is disposable output; do not hand-edit it.
- No root CI workflow is present in `.github/workflows`; local verification is the source of truth.
- Docker development bind-mounts the repo into `/app` and keeps `/app/node_modules` inside the container. After dependency changes, rebuild with `docker compose up --build` or `npm run docker:dev`.

## Commit Attribution
AI commits MUST include:
```
Co-Authored-By: OpenCode GPT-5.4 <noreply@openai.com>
```

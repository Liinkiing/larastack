# AGENTS.md
Operational guide for coding agents working in `larastack`.

## Scope and Precedence
- This repository is a template; consumers may keep only a subset of `backend/`, `frontend/`, and `mobile/`.
- Do not assume every workspace exists; check directories before running package-specific commands.
- Keep this root file global and cross-workspace only.
- Put package-specific guidance in package-local files:
  - `backend/AGENTS.md`
  - `frontend/AGENTS.md`
  - `mobile/AGENTS.md`
- When instructions conflict, prefer the nearest `AGENTS.md` to the files being edited.

## Workspace Snapshot
- Monorepo manager: `pnpm` workspaces. Use the pnpm version pinned by the root `packageManager` field.
- Optional packages in this template:
  - `backend/` -> Laravel 13, Lighthouse GraphQL, Sail
  - `frontend/` -> Next.js 16 App Router, Apollo Client, Panda CSS
  - `mobile/` -> Expo Router, React Native, Uniwind/Tailwind CSS 4

## Tool-Specific Instructions
Before editing, inspect applicable tool-specific instruction files if they exist, including:

- `.cursor/rules/**`
- `.cursorrules`
- `.github/copilot-instructions.md`

Do not record whether these files currently exist here; that snapshot becomes stale. Apply relevant tool-specific instructions together with the nearest `AGENTS.md`, while user and system instructions retain precedence.

## Common Commands
Run from repo root unless explicitly noted.

- Install JS deps: `pnpm install`
- Run a package script: `pnpm --filter <workspace-name> <script>`
- Run workspace tests (if configured): `pnpm --filter <workspace-name> test:ci`
- Known workspace names (if present):
  - `@larastack/backend`
  - `@larastack/frontend`
  - `@larastack/mobile`

## Shared Standards
- Make minimal, focused changes; avoid drive-by refactors.
- Follow local patterns in nearby files before introducing new ones.
- Never commit secrets (`.env`, tokens, credentials, keys).
- Prefer root-cause fixes over temporary workarounds.
- Use clear names; avoid cryptic abbreviations.
- Keep logs actionable and never include sensitive data.

## Linting and Formatting
- JS/TS linting uses `oxlint`.
- JS/TS formatting uses `oxfmt`.
- Pre-commit (`lint-staged`) runs:
  - `oxlint --fix` on `*.{js,jsx,ts,tsx}`
  - `oxfmt --write` on `*.{js,jsx,ts,tsx,json}`

## Git and PR Hygiene
- Commit style: Conventional Commits (`type(scope): subject`).
- Keep commits atomic and scoped.
- Use `.github/pull_request_template.md` when opening PRs.
- Include a short validation plan (lint/typecheck/tests/build) for risky changes.

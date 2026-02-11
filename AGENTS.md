# AGENTS.md
Operational guide for coding agents working in `larastack`.

## Workspace Snapshot
- Monorepo manager: `pnpm` workspaces.
- Apps:
  - `backend/` -> Laravel 12, Lighthouse GraphQL, Sail
  - `frontend/` -> Next.js 16 App Router, Apollo Client, Panda CSS
  - `mobile/` -> Expo Router, React Native, NativeWind/react-native-css

## Cursor/Copilot Rules
Checked paths:
- `.cursor/rules/**`
- `.cursorrules`
- `.github/copilot-instructions.md`

Current status: none of these files exist.
If they are added later, treat them as higher-priority instructions.

## Repo Map
- `backend/app/` - controllers, requests, models, services, resolvers
- `backend/graphql/` - Lighthouse schema modules
- `backend/tests/` - PHPUnit Unit/Feature suites
- `frontend/app/` - route-local App Router files
- `frontend/src/` - shared frontend code (`apollo`, `shared`, `theme`, `ui`)
- `mobile/src/app/` - Expo Router layouts/routes
- `mobile/src/ui/` - reusable mobile UI primitives
- Root tooling: `.oxlintrc.json`, `.lintstagedrc.js`, `commitlint.config.js`

## Documentation Priorities
- For Expo/mobile work, check relevant installed skills first (for example `expo-dev-client`, `expo-deployment`, `expo-cicd-workflows`, `upgrading-expo`, `expo-tailwind-setup`).
- For Expo setup issues, native integration, and common workflows/workarounds, consult official Expo docs and `https://github.com/expo/fyi` early before proposing custom fixes.
- Prefer stable, documented Expo patterns over ad-hoc workarounds when both are viable.

## Build/Lint/Test Commands
Run from repo root unless explicitly noted.

### Bootstrap
- JS deps: `pnpm install`
- PHP deps: `cd backend && composer install`
- Backend env: `cp backend/.env.example backend/.env`
- Start backend stack: `cd backend && ./vendor/bin/sail up -d`

### Frontend (`@larastack/frontend`)
- Dev: `pnpm --filter @larastack/frontend dev`
- Build: `pnpm --filter @larastack/frontend build`
- Start: `pnpm --filter @larastack/frontend start`
- Typecheck: `pnpm --filter @larastack/frontend ts:check`
- Lint: `pnpm --filter @larastack/frontend lint`
- Lint fix: `pnpm --filter @larastack/frontend lint:fix`
- Format: `pnpm --filter @larastack/frontend format`
- Format check: `pnpm --filter @larastack/frontend format:check`
- Storybook: `pnpm --filter @larastack/frontend storybook`

Single-file frontend checks:
- Lint one file: `pnpm --filter @larastack/frontend lint -- app/(public)/page.tsx`
- Format one file: `pnpm --filter @larastack/frontend exec oxfmt --write app/(public)/page.tsx`

### Mobile (`@larastack/mobile`)
- Dev: `pnpm --filter @larastack/mobile start`
- iOS: `pnpm --filter @larastack/mobile ios`
- Android: `pnpm --filter @larastack/mobile android`
- Web: `pnpm --filter @larastack/mobile web`
- Typecheck: `pnpm --filter @larastack/mobile ts:check`
- Lint: `pnpm --filter @larastack/mobile lint`
- Lint fix: `pnpm --filter @larastack/mobile lint:fix`
- Format: `pnpm --filter @larastack/mobile format`
- Format check: `pnpm --filter @larastack/mobile format:check`
- Health check: `pnpm --filter @larastack/mobile exec expo-doctor`

Single-file mobile checks:
- Lint one file: `pnpm --filter @larastack/mobile exec oxlint src/app/_layout.tsx`
- Format one file: `pnpm --filter @larastack/mobile exec oxfmt --write src/app/_layout.tsx`

### Backend (`@larastack/backend`)
- Dev (Vite): `pnpm --filter @larastack/backend dev`
- Build (Vite): `pnpm --filter @larastack/backend build`
- Lint/format PHP: `pnpm --filter @larastack/backend lint`
- Static analysis: `pnpm --filter @larastack/backend typecheck`
- Reset DB + seed: `pnpm --filter @larastack/backend db:reset`

### Tests (single test emphasized)
Backend PHPUnit is the only configured automated test suite.

- All tests: `cd backend && ./vendor/bin/sail phpunit`
- Single file: `cd backend && ./vendor/bin/sail phpunit tests/Feature/ExampleTest.php`
- Single method: `cd backend && ./vendor/bin/sail phpunit --filter test_example tests/Feature/ExampleTest.php`
- Single suite: `cd backend && ./vendor/bin/sail phpunit --testsuite Unit`

Notes:
- Prefer Sail commands so runtime matches project services.
- Frontend/mobile currently have no dedicated unit-test scripts in `package.json`.

### GraphQL and Codegen
- Full backend schema dump + frontend regen:
  `pnpm --filter @larastack/backend gql:dump`
- Frontend-only GraphQL codegen:
  `pnpm --filter @larastack/frontend gen:gql`

Run codegen after changes in:
- `backend/graphql/**/*.graphql`
- `frontend/app/**/*.ts(x)` GraphQL operations
- `frontend/src/**/*.ts(x)` GraphQL operations

## Code Style Guidelines

### General Principles
- Make minimal, focused changes; avoid drive-by refactors.
- Follow local patterns in nearby files before introducing new patterns.
- Never commit secrets (`.env`, tokens, credentials, keys).
- Prefer root-cause fixes over temporary workarounds.

### Imports and Structure
- Use type-only imports in TS (`import type { X } from '...'`).
- Keep import groups ordered: framework -> third-party -> generated -> internal.
- Frontend aliases: `~/*` -> `frontend/src/*`, `~app/*` -> `frontend/app/*`.
- Mobile aliases: `~/*` -> `mobile/src/*`.
- Co-locate route-specific UI in `app/`; put reusable UI in shared directories.

### Formatting and Linting
- JS/TS linting uses `oxlint`.
- JS/TS formatting uses `oxfmt`.
- PHP formatting uses Pint (`laravel` preset) through Sail.
- Pre-commit (`lint-staged`) runs:
  - `oxlint --fix` on `*.{js,jsx,ts,tsx}`
  - `oxfmt --write` on `*.{js,jsx,ts,tsx,json}`

### Types and React
- Keep strict typing; avoid new `any` unless truly unavoidable.
- Prefer `unknown` for caught errors and narrow before use.
- Add explicit return types for shared utilities/hooks/services.
- Use `as const` for enum-like literal maps.
- Next.js App Router defaults to Server Components; add `'use client'` only when required.

### Laravel and GraphQL
- Use Form Requests for validation and authorization.
- Prefer explicit return types in controllers/resolvers where practical.
- Prefer explicit imports over implicit global aliases.
- Keep GraphQL schema descriptions/documentation consistent and clear.
- Prefer `final` for classes not meant to be extended.

### Naming Conventions
- Use clear, descriptive names; avoid cryptic abbreviations.
- Components/classes/types: PascalCase.
- Functions/methods/variables: camelCase.
- PHPUnit methods should clearly describe behavior (commonly `test_*`).

### Error Handling and Logging
- Throw framework-appropriate exceptions for auth/validation/authorization failures.
- Keep logs structured with actionable context (IDs, operation names, metadata).
- Never log secrets or raw sensitive data.
- Keep production logging quiet; gate debug logs behind environment checks.

## Git and PR Hygiene
- Commit style: Conventional Commits (`type(scope): subject`).
- Keep commits atomic and scoped.
- Use `.github/pull_request_template.md` when opening PRs.
- Include a short validation plan (lint/typecheck/tests/build) for risky changes.

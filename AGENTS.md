# Agent Guidelines (Larastack)

This monorepo uses pnpm workspaces with three apps:
- `backend/` (Laravel 12 + Lighthouse + Sail)
- `frontend/` (Next.js 16 App Router + Apollo + Panda)
- `mobile/` (Expo Router + React Native)

## Rule Sources Checked

No Cursor/Copilot rule files were found at the time of writing:
- `.cursor/rules/**` (not present)
- `.cursorrules` (not present)
- `.github/copilot-instructions.md` (not present)

If these files are added later, treat them as higher-priority instructions for agents.

## Repo Map

- `backend/app/`: Laravel application code (controllers, requests, GraphQL resolvers, etc.)
- `backend/graphql/`: Lighthouse GraphQL schema split into modules
- `frontend/app/`: route-specific Next.js App Router files
- `frontend/src/`: shared frontend code (`shared/`, `ui/`, `theme/`, `apollo/`)
- `mobile/app/`: Expo Router route files
- Root tooling: `pnpm-workspace.yaml`, `.lintstagedrc.js`, `commitlint.config.js`, `.oxlintrc.json`

## Build / Lint / Test Commands

Run all `pnpm` commands from repository root unless noted.

### Bootstrap

- Install JS workspace deps: `pnpm install`
- Install backend PHP deps: `cd backend && composer install`
- Create backend env file: `cp backend/.env.example backend/.env`
- Start backend services: `cd backend && ./vendor/bin/sail up -d`

### Frontend (`@larastack/frontend`)

- Dev: `pnpm --filter @larastack/frontend dev`
- Build: `pnpm --filter @larastack/frontend build`
- Start prod server: `pnpm --filter @larastack/frontend start`
- Typecheck: `pnpm --filter @larastack/frontend ts:check`
- Lint: `pnpm --filter @larastack/frontend lint`
- Lint + fix: `pnpm --filter @larastack/frontend lint:fix`
- Format: `pnpm --filter @larastack/frontend format`
- Format check: `pnpm --filter @larastack/frontend format:check`
- Storybook: `pnpm --filter @larastack/frontend storybook`

Single-file frontend checks:
- Lint one file: `pnpm --filter @larastack/frontend lint -- app/(public)/page.tsx`
- Format one file: `pnpm --filter @larastack/frontend exec oxfmt --write app/(public)/page.tsx`

### Mobile (`@larastack/mobile`)

- Dev server: `pnpm --filter @larastack/mobile start`
- iOS: `pnpm --filter @larastack/mobile ios`
- Android: `pnpm --filter @larastack/mobile android`
- Web: `pnpm --filter @larastack/mobile web`
- Lint: `pnpm --filter @larastack/mobile lint`
- Lint + fix: `pnpm --filter @larastack/mobile lint:fix`
- Format: `pnpm --filter @larastack/mobile format`
- Format check: `pnpm --filter @larastack/mobile format:check`

Single-file mobile checks:
- Lint one file: `pnpm --filter @larastack/mobile exec oxlint app/_layout.tsx`
- Format one file: `pnpm --filter @larastack/mobile exec oxfmt --write app/_layout.tsx`

### Backend (`@larastack/backend`)

- Vite dev: `pnpm --filter @larastack/backend dev`
- Vite build: `pnpm --filter @larastack/backend build`
- Lint/format (Pint): `pnpm --filter @larastack/backend lint`
- Typecheck (Larastan via Sail): `pnpm --filter @larastack/backend typecheck`
- Reset database: `pnpm --filter @larastack/backend db:reset`

### Backend Tests (single test emphasized)

Use Sail to match containerized services:
- All tests: `cd backend && ./vendor/bin/sail phpunit`
- Single file: `cd backend && ./vendor/bin/sail phpunit tests/Feature/AuthTest.php`
- Single test method: `cd backend && ./vendor/bin/sail phpunit --filter test_login_succeeds tests/Feature/AuthTest.php`
- Single suite: `cd backend && ./vendor/bin/sail phpunit --testsuite Unit`

### GraphQL / Codegen Sync

- Full schema + frontend regen: `pnpm --filter @larastack/backend gql:dump`
- Frontend-only GraphQL regen: `pnpm --filter @larastack/frontend gen:gql`

Run codegen after changing GraphQL schema/documents in:
- `backend/graphql/**/*.graphql`
- frontend GraphQL operations in `frontend/app/**/*.ts(x)` or `frontend/src/**/*.ts(x)`

## Coding Standards

### General

- Prefer minimal, local changes; avoid unrelated refactors.
- Never commit secrets (`.env`, API keys, credentials).
- Use existing linters/formatters instead of manual style tweaks.
- Follow existing naming patterns in nearby files first.

### Imports

- Use TypeScript type-only imports: `import type { Foo } from '...'`.
- Frontend aliases: `~/*` for `frontend/src/*`, `~app/*` for `frontend/app/*`.
- Mobile alias: `~/*` for `mobile/*`.
- Keep import groups ordered: framework, third-party, generated, internal.

### Formatting / Linting

- JavaScript/TypeScript linting uses `oxlint`.
- JavaScript/TypeScript formatting uses `oxfmt`.
- Backend PHP formatting uses Pint (`laravel` preset).
- Pre-commit (`lint-staged`) runs:
  - `oxlint --fix` on `*.{js,jsx,ts,tsx}`
  - `oxfmt --write` on `*.{js,jsx,ts,tsx,json}`

### TypeScript / React / Next (frontend + mobile)

- Keep TS strictness; avoid introducing `any` unless unavoidable.
- Prefer `unknown` for caught errors and narrow explicitly.
- Prefer explicit return types for shared hooks/utilities/services.
- Use `as const` for enum-like constant maps.
- Next.js defaults to Server Components; add `'use client'` only when required.
- Co-locate route-specific UI in `app/` route folders; keep reusable UI in shared directories.

### Styling (frontend)

- Prefer Panda design tokens/semantic tokens over hardcoded values.
- Use `~/styled-system/jsx` layout primitives.
- Keep recipes in `frontend/src/theme/recipes/*` predictable and composable.

### Laravel / PHP (backend)

- Prefer Form Requests for validation and authorization.
- Use explicit return types in controllers/resolvers when possible.
- Prefer explicit facade imports over global aliases.
- Keep GraphQL schema docs in triple quotes and directives consistent.
- Prefer `final` on small classes not intended for inheritance.

### Naming Conventions

- Use descriptive names; avoid abbreviations unless common domain terms.
- Components/classes: PascalCase. Functions/variables: camelCase.
- Test names should describe behavior (for PHPUnit, clear `test_*` intent).

### Error Handling / Logging

- Throw framework-appropriate exceptions (Laravel auth/validation/authorization).
- For frontend GraphQL errors, use centralized handling in Apollo links.
- Avoid noisy production logs; gate debug output behind dev checks.
- Log structured context (IDs/metadata), never secrets or tokens.

## Git & PR Hygiene

- Commit messages follow Conventional Commits: `type(scope): subject`.
- Keep commits focused and atomic.
- Use `.github/pull_request_template.md` when opening PRs.
- Include a short testing plan for risky changes.

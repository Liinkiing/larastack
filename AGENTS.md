# Agent Guidelines (Larastack)

This repo is a pnpm workspace with a Laravel 12 backend and a Next.js 16 App Router frontend.

## Repo Map

- `backend/`: Laravel API + Lighthouse GraphQL + Sail + Vite assets
- `frontend/`: Next.js app; routes in `frontend/app/`, shared logic in `frontend/src/shared/`, UI primitives in `frontend/src/ui/`, theme/tokens in `frontend/src/theme/`
- Root tooling: `pnpm-workspace.yaml`, `.lintstagedrc.js`, `commitlint.config.js`

## Commands (Build/Lint/Test)

All pnpm commands are meant to be run from repo root.

### Install / Bootstrap

- JS deps (workspace): `pnpm install`
- Backend PHP deps: `cd backend && composer install`
- Backend env: `cp backend/.env.example backend/.env` (then set secrets locally)
- Sail up: `cd backend && ./vendor/bin/sail up -d`

### Frontend (Next.js)

- Dev (runs GraphQL + Panda codegen first): `pnpm --filter=frontend dev`
- Build (runs Panda + GraphQL codegen first): `pnpm --filter=frontend build`
- Start: `pnpm --filter=frontend start`
- Typecheck: `pnpm --filter=frontend ts:check`
- Lint: `pnpm --filter=frontend lint`
- Lint (fix): `pnpm --filter=frontend lint:fix`
- Format (write): `pnpm --filter=frontend format`
- Format (check): `pnpm --filter=frontend format:check`
- Storybook: `pnpm --filter=frontend storybook`

Useful "single file" checks:

- Lint one file: `pnpm --filter=frontend lint -- app/(public)/page.tsx`
- Format one file: `pnpm --filter=frontend exec oxfmt --write app/(public)/page.tsx`

### Backend (Laravel)

- Dev (Vite): `pnpm --filter=backend dev`
- Build (Vite): `pnpm --filter=backend build`
- Format/lint (Pint): `pnpm --filter=backend lint`
- Typecheck (PHPStan via Sail): `pnpm --filter=backend typecheck`
- Reset DB: `pnpm --filter=backend db:reset`

### Backend Tests (PHPUnit) - including single test

Run with Sail (preferred so container services match):

- All tests: `cd backend && ./vendor/bin/sail phpunit`
- Single test file: `cd backend && ./vendor/bin/sail phpunit tests/Feature/AuthTest.php`
- Single test method: `cd backend && ./vendor/bin/sail phpunit --filter test_login_succeeds tests/Feature/AuthTest.php`
- Single suite: `cd backend && ./vendor/bin/sail phpunit --testsuite Unit`

### GraphQL / Codegen Sync

- Backend schema dump + frontend regen: `pnpm --filter=backend gql:dump`
  - Writes backend schema to `backend/storage/app/private/lighthouse-schema.graphql`
  - Copies to `frontend/schema.graphql`
  - Regenerates frontend types in `frontend/src/__generated__/gql/`

If you touch any of:

- `backend/graphql/**/*.graphql` or Lighthouse directives/resolvers
- `frontend/app/**/*.ts(x)` / `frontend/src/**/*.ts(x)` GraphQL documents

...run `pnpm --filter=backend gql:dump` (or at least `pnpm --filter=frontend gen:gql`).

## Code Style (General)

- Prefer the repo's formatters/linters over manual alignment.
- Keep changes local: avoid unrelated refactors while fixing a bug/feature.
- Don't commit secrets (`.env`, credentials, tokens).

## Frontend Style (TypeScript / React / Next)

### Language + Types

- TypeScript is `strict` (`frontend/tsconfig.json`); don't "work around" with `any` unless you have no alternative.
- Prefer `unknown` for caught errors and narrow with type guards.
- Use `NonNullable<T>` and explicit return types for shared hooks/services.
- Prefer `as const` for "enum-ish" objects (see `frontend/src/shared/env.ts`).

### Imports

- Use path aliases: `~/*` for `frontend/src/*` and `~app/*` for `frontend/app/*`.
- Use `import type { ... }` for type-only imports.
- Keep imports grouped with blank lines:
  - React/Next first
  - Third-party libs
  - Generated code (`~/__generated__/...`)
  - Internal modules (`~/...`)

### Components + Files

- Next App Router:
  - Server components by default; add `'use client'` only when needed (hooks, state, browser APIs).
  - Put route-specific components next to the route under `frontend/app/...`.
  - Shared components/providers/layouts live under `frontend/src/shared/...`.
- UI primitives live in `frontend/src/ui/` and should be styled via Panda/Ark recipes.

### Styling (Panda CSS + Ark UI)

- Prefer Panda tokens/semantic tokens over raw hex values.
- Use `~/styled-system/jsx` primitives (`Stack`, `Box`, etc.) for layout.
- Add/adjust recipes in `frontend/src/theme/recipes/*` and keep variants predictable.
- Keep typography consistent with text styles in `frontend/src/theme/text-styles.ts`.

### GraphQL (Apollo Client)

- Define operations/fragments with the `graphql` tagged template (scanned by codegen).
- Prefer colocated fragments near the component using them.
- Use fragment masking helpers (`getFragmentData`) and `useFragment` wrapper when reading fragments.
- Don't manually edit generated files in `frontend/src/__generated__/gql/`.

### Error Handling

- For GraphQL errors, rely on the centralized error link (`frontend/src/apollo/links/error.ts`) and present user-safe messages.
- Avoid `console.error` noise in production paths; gate debug logs behind `compilerEnv.__DEV__`.
- Prefer rendering a fallback UI (error boundary/layout) over `window.alert` for new work.

## Backend Style (Laravel / PHP)

### Formatting + Static Analysis

- Format/lint: Pint (`backend/pint.json`, preset `laravel`) via `pnpm --filter=backend lint`.
- Typecheck: PHPStan (Larastan) via `pnpm --filter=backend typecheck` (`backend/phpstan.neon`, level 6).

### Naming + Structure

- Controllers: `backend/app/Http/Controllers/...` with explicit return types (`Response`, `JsonResponse`, etc.).
- Validation: prefer Form Requests (`backend/app/Http/Requests/...`) for request validation/auth.
- GraphQL:
  - Schema in `backend/graphql/**/*.graphql` (imported by `backend/graphql/schema.graphql`).
  - Custom scalars/directives/resolvers under `backend/app/GraphQL/...`.
  - Keep schema docs in triple quotes and use Lighthouse directives consistently (`@field`, `@rename`, `@guard`, etc.).

### Imports + Facades

- Prefer explicit facade imports (`use Illuminate\Support\Facades\Auth;`) over global aliases.
- Prefer `final` for small resolver classes when extension isn't intended.

### Error Handling + Logging

- Throw framework exceptions that map cleanly to HTTP/GraphQL (`AuthorizationException`, validation exceptions, etc.).
- Log with context arrays (ids, provider, input metadata) and avoid logging secrets.
- Use helpers intentionally (e.g., `frontend_url()` from `backend/app/helpers.php`).

## Git Hygiene (Commit/PR)

- Conventional Commits enforced by commitlint: `type(scope): subject` (e.g., `feat(frontend): add login form`).
- Pre-commit runs lint-staged:
  - `oxlint --fix` on `*.{js,jsx,ts,tsx}`
  - `oxfmt --write` on `*.{js,jsx,ts,tsx,json}`
- PR template lives at `.github/pull_request_template.md` (fill context + solution; add a testing plan when risky).

# AGENTS.md

Guidance for agentic coding tools working in this repo. Prefer thin end-to-end loops: change -> format/lint -> typecheck -> targeted test -> build.

## Repo Map

- `frontend/`: Vite + TanStack Start (SPA) + TanStack Router + Apollo Client + Panda CSS.
  - Routes: `frontend/src/routes/` (file-based).
  - Shared app logic: `frontend/src/shared/`.
  - Design system + tokens: `frontend/src/ui/`, `frontend/src/theme/`.
  - Generated: `frontend/src/__generated__/gql/`, `frontend/src/styled-system/`, `frontend/src/routeTree.gen.ts`.
- `backend/`: Laravel 12 API + Lighthouse GraphQL + Sail.
  - HTTP: `backend/app/Http/`, `backend/routes/`.
  - GraphQL schema: `backend/graphql/` (split via `#import`).
  - GraphQL PHP: `backend/app/GraphQL/` (directives, resolvers, scalars).
  - Tests: `backend/tests/`.
- Workspace tooling: `pnpm-workspace.yaml`, `.lintstagedrc.js`, `commitlint.config.js`.

## Commands (Copy/Paste)

### Install

- Workspace deps: `pnpm install`
- Backend PHP deps (if missing): `cd backend && composer install`

### Frontend (Vite)

- Dev (runs codegen first): `pnpm --filter frontend dev`
- Build (runs codegen first): `pnpm --filter frontend build`
- Typecheck: `pnpm --filter frontend ts:check`
- Lint: `pnpm --filter frontend lint`
- Lint (fix): `pnpm --filter frontend lint:fix`
- Format check: `pnpm --filter frontend format:check`
- Storybook: `pnpm --filter frontend storybook`

### Frontend Codegen

- GraphQL types: `pnpm --filter frontend gen:gql`
- Panda CSS: `pnpm --filter frontend gen:panda`
- Both (what `predev`/`prebuild` do): `pnpm --filter frontend gen:gql && pnpm --filter frontend gen:panda`

### Backend (Laravel + Sail)

- Dev: `pnpm --filter backend dev`
- Build (Vite assets): `pnpm --filter backend build`
- Format/lint (Pint): `pnpm --filter backend lint`
- Typecheck (PHPStan via Sail): `pnpm --filter backend typecheck`
- Reset DB: `pnpm --filter backend db:reset`

### Backend Tests (PHPUnit)

- All tests: `cd backend && ./vendor/bin/sail phpunit`
- Single test file: `cd backend && ./vendor/bin/sail phpunit tests/Feature/ExampleTest.php`
- Single test method: `cd backend && ./vendor/bin/sail phpunit --filter test_it_does_something`
- Suite only: `cd backend && ./vendor/bin/sail phpunit --testsuite Feature`

Tip: `php artisan test` also works under Sail (`cd backend && ./vendor/bin/sail artisan test`), but prefer `phpunit` for parity with CI/config.

### GraphQL Schema Sync (backend -> frontend)

- Dump Lighthouse schema + regenerate frontend types:
  `pnpm --filter backend gql:dump`
  - Writes backend schema to `backend/storage/app/private/lighthouse-schema.graphql`
  - Copies to `frontend/schema.graphql`
  - Runs `pnpm --filter '../frontend' gen:gql`

## Formatting & Linting

- JS/TS: `oxlint` + `oxfmt`.
  - Pre-commit uses lint-staged (see `.lintstagedrc.js`):
    - `oxlint --fix` on `*.{js,jsx,ts,tsx}`
    - `oxfmt --write` on `*.{js,jsx,ts,tsx,json}`
- PHP: `laravel/pint` (preset `laravel`, see `backend/pint.json`).

Do not hand-format; run the tool.

## Code Style Guidelines

### General

- Keep changes small and local; avoid drive-by refactors.
- Prefer explicitness over cleverness; optimize for readability.
- Don’t edit generated output (see “Generated Files”). Regenerate instead.
- Fail fast on invalid inputs; don’t silently swallow errors.

### Imports

- Use `import type` for types (TypeScript); keep type-only imports separate from value imports.
- Prefer workspace aliases over deep relatives:
  - `~/...` maps to `frontend/src/...` (see `frontend/tsconfig.json`).
- Avoid circular imports; move shared code into `frontend/src/shared/`.

### TypeScript / React

- TypeScript is `strict` (`frontend/tsconfig.json`). Avoid `any`.
  - If a library forces it, narrow via `unknown` first, then cast once.
- Prefer:
  - Discriminated unions for state machines.
  - `zod` schemas for form/URL validation; keep schema close to usage.
- Components:
  - PascalCase component names, files match exported component when possible.
  - Keep props small; prefer composition over boolean prop explosions.
- State/effects:
  - Avoid non-null assertions (`!`) unless the invariant is truly guaranteed.
  - Memoize only when it matters; don’t cargo-cult `useMemo`.

### GraphQL (Frontend)

- Define operations using the codegen `graphql` template tag (see `frontend/src/shared/hooks/useAuth.ts`).
- Prefer using generated `*Document` nodes and generated result types from `~/__generated__/gql/graphql`.
- When changing schema on the backend, run `pnpm --filter backend gql:dump` to keep `frontend/schema.graphql` + generated types in sync.
- Handle GraphQL/network errors centrally (see `frontend/src/apollo/links/error.ts`); avoid ad-hoc `try/catch` around `useQuery`.

### PHP / Laravel

- Follow Pint (Laravel preset). Don’t reformat by hand.
- Prefer Form Requests for validation (`backend/app/Http/Requests/**`).
- Authorization:
  - Use Policies/Gates (`backend/app/Policies/**`) and check them in controllers/resolvers.
- Error handling:
  - Validation: throw `ValidationException` (or let FormRequest handle).
  - Unauthorized: use `abort(403)` / `AuthorizationException` or policy checks.
  - Prefer returning proper HTTP status codes (`response()->noContent()`, etc.).
- Types:
  - Typehint params/returns aggressively; add array shapes in PHPDoc when helpful.
  - Keep PHPStan happy (see `backend/phpstan.neon`, level 6).

### GraphQL (Backend)

- Schema is split across `backend/graphql/**` and assembled by `#import` in `backend/graphql/schema.graphql`.
- Resolvers are typically invokable classes in `backend/app/GraphQL/Resolvers/**`.
- Prefer Lighthouse directives where possible; only drop to custom PHP when needed.

## Generated Files (Do Not Edit)

- `frontend/src/__generated__/gql/**` (GraphQL Codegen output)
- `frontend/src/styled-system/**` (Panda CSS codegen output)
- `frontend/src/routeTree.gen.ts` (TanStack Router generation)

## Naming Conventions

- React components: `PascalCase`.
- Hooks: `useX`.
- Types/interfaces: `PascalCase`; use `type` aliases by default, `interface` for public/extensible shapes.
- Laravel:
  - Classes: `PascalCase` + PSR-4 under `App\`.
  - Migrations: timestamped names in `backend/database/migrations/`.

## Commits / PRs

- Conventional Commits required: `type(scope): subject` (commitlint).
- Scopes to use: `frontend`, `backend`, `repo` (or a specific area).
- If a UI change is user-facing, include screenshots/GIFs in the PR.

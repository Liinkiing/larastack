# Repository Guidelines

## Project Structure & Module Organization

- `backend/`: Laravel 12 API, Lighthouse GraphQL, and Sail tooling. Key areas: `app/`, `config/`, `routes/`, `graphql/`, `database/`, `tests/`.
- `frontend/`: Next.js app. Routes live in `app/`, shared UI logic in `src/shared/`, design system in `src/ui/` and `src/theme/`.
- `frontend/public/` and `backend/public/`: static assets.
- Root config: `pnpm-workspace.yaml`, `commitlint.config.js`, `.lintstagedrc.js`.

## Build, Test, and Development Commands

- Frontend dev: `pnpm --filter=frontend dev` (runs Next.js with Turbopack; predev runs GraphQL + Panda codegen).
- Frontend build: `pnpm --filter=frontend build` (prebuild runs Panda + GraphQL codegen).
- Frontend lint/typecheck: `pnpm --filter=frontend lint` and `pnpm --filter=frontend ts:check`.
- Storybook: `pnpm --filter=frontend storybook`.
- Backend dev: `pnpm --filter=backend dev` (Vite for frontend assets).
- Backend build: `pnpm --filter=backend build`.
- Backend lint/typecheck: `pnpm --filter=backend lint` (Pint) and `pnpm --filter=backend typecheck` (PHPStan via Sail).
- GraphQL schema sync: `pnpm --filter=backend gql:dump` (writes `frontend/schema.graphql` and regenerates frontend types).

## Coding Style & Naming Conventions

- JavaScript/TypeScript: OXLint + OXFmt.
- PHP: Laravel Pint (`backend/pint.json`, preset `laravel`).
- Naming: use PascalCase for React components and PHP classes, `useX` for hooks, and Laravel’s timestamped migration names in `backend/database/migrations/`.
- Prefer formatting via the tooling above rather than manual alignment.

## Testing Guidelines

- Backend tests use PHPUnit (`backend/phpunit.xml`) under `tests/Unit` and `tests/Feature`.
  - Run with Sail: `cd backend && ./vendor/bin/sail phpunit`.
- No frontend test runner is configured; use Storybook for UI verification and keep GraphQL codegen in sync.
- After heavy frontend modifications, run `pnpm --filter=frontend ts:check` and then `pnpm --filter=frontend lint`.

## Commit & Pull Request Guidelines

- Conventional Commits are required (commitlint + Husky). Use `type(scope): subject`, e.g., `feat(frontend): add login form`.
- Pre-commit runs lint-staged (OXLint + OXFmt on changed files). Fix lint before pushing.
- PRs should include: a clear description, linked issues (if any), and screenshots/GIFs for UI changes. Note if `pnpm gql:dump` updated `frontend/schema.graphql`.

## Security & Configuration Tips

- Backend env: copy `backend/.env.example` to `backend/.env` and set secrets locally.
- Avoid committing secrets; rely on `.env` and Laravel config defaults.

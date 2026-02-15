# AGENTS.md
Operational guide for coding agents working in `backend/`.

## Scope and Precedence
- Applies to files under `backend/`.
- This file overrides root guidance for backend-specific choices.

## Stack
- Laravel 12
- Lighthouse GraphQL
- Laravel Sail

## Key Paths
- `app/` -> controllers, requests, models, services, resolvers
- `graphql/` -> Lighthouse schema modules
- `tests/` -> PHPUnit Unit/Feature suites
- `scripts/` -> backend maintenance helpers

## Setup and Runtime
Run from `backend/` unless otherwise noted.

- Install PHP deps: `./vendor/bin/sail composer install`
- Initialize env file: `cp .env.example .env`
- Start services: `./vendor/bin/sail up -d`

## Commands
Run from repo root unless otherwise noted.

- Dev (Vite): `pnpm --filter @larastack/backend dev`
- Build (Vite): `pnpm --filter @larastack/backend build`
- Lint/format PHP (Pint, Laravel preset): `pnpm --filter @larastack/backend lint`
- Static analysis: `pnpm --filter @larastack/backend typecheck`
- Reset DB + seed: `pnpm --filter @larastack/backend db:reset`
- Dump GraphQL schema and sync clients: `pnpm --filter @larastack/backend gql:dump`

### PHPUnit (Sail)
- All tests: `./vendor/bin/sail phpunit`
- Single file: `./vendor/bin/sail phpunit tests/Feature/ExampleTest.php`
- Single method: `./vendor/bin/sail phpunit --filter test_example tests/Feature/ExampleTest.php`
- Single suite: `./vendor/bin/sail phpunit --testsuite Unit`

## Backend Standards
- Run PHP tooling commands (for example `composer`, `artisan`, `phpunit`) through Sail when available.
- PHP formatting uses Pint (Laravel preset) via Sail.
- Use Form Requests for validation/authorization.
- Prefer explicit return types in controllers/resolvers when practical.
- Prefer explicit imports over implicit aliases.
- Keep GraphQL schema descriptions clear and consistent.
- Prefer `final` for classes not designed for inheritance.
- Throw framework-appropriate exceptions for auth/validation/authorization failures.
- Keep logs structured and actionable; never log secrets.

## GraphQL and Client Sync
- After schema changes under `backend/graphql/**/*.graphql`, run `pnpm --filter @larastack/backend gql:dump`.
- If `frontend/` exists, regenerate frontend operations: `pnpm --filter @larastack/frontend gen:gql`.
- If `mobile/` exists, regenerate mobile operations: `pnpm --filter @larastack/mobile gen:gql`.

# AGENTS.md
Operational guide for coding agents working in `backend/`.

## Scope and Precedence
- Applies to files under `backend/`.
- This file overrides root guidance for backend-specific choices.

## Stack
- Laravel 13
- Lighthouse GraphQL
- Laravel Sail

## Key Paths
- `app/` -> controllers, requests, models, services, resolvers
- `graphql/` -> Lighthouse schema modules
- `tests/` -> Pest Unit/Feature suites running on PHPUnit
- `scripts/` -> backend maintenance helpers

## Setup and Runtime
Run from `backend/` unless otherwise noted.

- First install: if `vendor/bin/sail` is absent, follow the Composer bootstrap container step in `backend/README.md`; Sail cannot install itself.
- Install PHP deps after Sail exists: `./vendor/bin/sail composer install`
- Initialize env file: `cp .env.example .env`
- Start services: `./vendor/bin/sail up -d`

## Commands
Run from repo root unless otherwise noted.

- Dev (Vite): `pnpm --filter @larastack/backend dev`
- Build (Vite): `pnpm --filter @larastack/backend build`
- Lint/format PHP (Pint, Laravel preset): `pnpm --filter @larastack/backend lint`
- Static analysis: `pnpm --filter @larastack/backend typecheck`
- Reset DB + seed: `pnpm --filter @larastack/backend db:reset`
- Dump GraphQL schema and sync client schema files: `pnpm --filter @larastack/backend gql:dump`

### Pest (Sail)
Run these from `backend/`.

- All tests: `./vendor/bin/sail pest`
- Single file: `./vendor/bin/sail pest tests/Feature/ExampleTest.php`
- Filter by name: `./vendor/bin/sail pest --filter="health response"`
- Single suite: `./vendor/bin/sail pest --testsuite=Unit`

## Backend Standards
- Run PHP tooling commands (for example `composer`, `artisan`, `pest`) through Sail when available.
- Repository-specific exception to generated Sail guidance: run JavaScript workspace commands through root `pnpm --filter @larastack/backend ...`; do not run pnpm workspace tooling through Sail.
- Do not run local cache/optimization commands such as `config:cache`, `route:cache`, `view:cache`, `event:cache`, or `optimize` during development/testing unless explicitly requested; these are deployment steps and can make local tests/config read stale values.
- If cache/optimization commands are explicitly needed for deployment validation, run `./vendor/bin/sail artisan optimize:clear`, `./vendor/bin/sail artisan lighthouse:clear-schema-cache`, and `./vendor/bin/sail artisan lighthouse:clear-query-cache` immediately after validation.
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

===

<laravel-boost-guidelines>
=== .ai/app.actions rules ===

# Application Actions

This application uses single-purpose Action classes for reusable business operations. Actions are an architectural boundary, not a requirement to wrap every controller line in another class.

## Convention

- Place actions directly in `app/Actions` unless a clear domain subfolder becomes necessary.
- Name actions with an imperative verb phrase and no `Action` suffix: `CreateUser`, `IssueMobileToken`, `ConnectGoogleAccount`.
- Give every action one public entry point named `handle()`. If generic guidance shows `execute()`, this project's `handle()` convention wins.
- Declare actions `final readonly` when their dependencies and state allow it.
- Inject dependencies through the constructor using private promoted properties. Do not call `app()` or `resolve()` inside production action code.
- Let actions compose other actions through constructor injection when one business operation contains another.

```php
<?php

declare(strict_types=1);

namespace App\Actions;

final readonly class CreateFavorite
{
    public function __construct(private FavoriteService $favorites)
    {
    }

    public function handle(User $user, string $favorite): bool
    {
        return $this->favorites->add($user, $favorite);
    }
}
```

## Boundaries

- Keep controllers, GraphQL resolvers, jobs, commands, and other transports focused on transport concerns: authorization, validated input mapping, invoking an action, and formatting the response.
- Keep actions independent of HTTP and GraphQL types. Accept typed domain values, models, enums, or purpose-built data objects rather than `Request`, `JsonResponse`, or resolver context objects.
- Return domain results such as models, value objects, enums, or scalars. The caller owns redirects, JSON payloads, status codes, and GraphQL response shape.
- Keep reusable infrastructure capabilities and external protocol adapters as Services. For example, token verification and an external payment gateway are Services; registering a user or completing a payment is an Action that may use those Services.
- Do not extract trivial pass-through behavior solely to satisfy the pattern. Extract an Action when the operation represents business intent, coordinates multiple steps, is reused across entry points, contains meaningful branching, or benefits from an explicit transaction boundary.

## Transactions and side effects

- Wrap related database writes in `DB::transaction()` when they must succeed or fail as one operation.
- Keep slow external network calls outside open database transactions whenever possible.
- Dispatch events, notifications, broadcasts, and jobs after the transaction commits when consumers require committed state.

## Creating actions

This project does not install a dedicated `make:action` package. Create the class with Sail, then apply the convention above:

```bash
vendor/bin/sail artisan make:class "Actions/CreateUser" --no-interaction
```

Do not add a package only to generate this small class shape.

## Testing

- Preserve behavioral coverage through the most useful test boundary.
- Direct Action tests are optional when feature tests already cover the operation clearly.
- Add focused Action tests when an action has substantial branching, business invariants, transaction behavior, or reuse across multiple entry points. Do not duplicate feature assertions merely to satisfy the pattern.

=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.5
- laravel/framework (LARAVEL) - v13
- laravel/prompts (PROMPTS) - v0
- laravel/sanctum (SANCTUM) - v4
- laravel/socialite (SOCIALITE) - v5
- larastan/larastan (LARASTAN) - v3
- laravel/boost (BOOST) - v2
- laravel/mcp (MCP) - v0
- laravel/pail (PAIL) - v1
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- laravel/telescope (TELESCOPE) - v5
- pestphp/pest (PEST) - v4
- phpunit/phpunit (PHPUNIT) - v12

## Skills Activation

This project has domain-specific skills available in `**/skills/**`. You MUST activate the relevant skill whenever you work in that domain—don't wait until you're stuck.

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `vendor/bin/sail npm run build`, `vendor/bin/sail npm run dev`, or `vendor/bin/sail composer run dev`. Ask them.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

=== boost rules ===

# Laravel Boost

## Tools

- Laravel Boost is an MCP server with tools designed specifically for this application. Prefer Boost tools over manual alternatives like shell commands or file reads.
- Use `database-query` to run read-only queries against the database instead of writing raw SQL in tinker.
- Use `database-schema` to inspect table structure before writing migrations or models.
- Use `get-absolute-url` to resolve the correct scheme, domain, and port for project URLs. Always use this before sharing a URL with the user.
- Use `browser-logs` to read browser logs, errors, and exceptions. Only recent logs are useful, ignore old entries.

## Searching Documentation (IMPORTANT)

- Always use `search-docs` before making code changes. Do not skip this step. It returns version-specific docs based on installed packages automatically.
- Pass a `packages` array to scope results when you know which packages are relevant.
- Use multiple broad, topic-based queries: `['rate limiting', 'routing rate limiting', 'routing']`. Expect the most relevant results first.
- Do not add package names to queries because package info is already shared. Use `test resource table`, not `filament 4 test resource table`.

### Search Syntax

1. Use words for auto-stemmed AND logic: `rate limit` matches both "rate" AND "limit".
2. Use `"quoted phrases"` for exact position matching: `"infinite scroll"` requires adjacent words in order.
3. Combine words and phrases for mixed queries: `middleware "rate limit"`.
4. Use multiple queries for OR logic: `queries=["authentication", "middleware"]`.

## Artisan

- Run Artisan commands directly via the command line (e.g., `vendor/bin/sail artisan route:list`). Use `vendor/bin/sail artisan list` to discover available commands and `vendor/bin/sail artisan [command] --help` to check parameters.
- Inspect routes with `vendor/bin/sail artisan route:list`. Filter with: `--method=GET`, `--name=users`, `--path=api`, `--except-vendor`, `--only-vendor`.
- Read configuration values using dot notation: `vendor/bin/sail artisan config:show app.name`, `vendor/bin/sail artisan config:show database.default`. Or read config files directly from the `config/` directory.

## Tinker

- Execute PHP in app context for debugging and testing code. Do not create models without user approval, prefer tests with factories instead. Prefer existing Artisan commands over custom tinker code.
- Always use single quotes to prevent shell expansion: `vendor/bin/sail artisan tinker --execute 'Your::code();'`
  - Double quotes for PHP strings inside: `vendor/bin/sail artisan tinker --execute 'User::where("active", true)->count();'`

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`. Do not leave empty zero-parameter `__construct()` methods unless the constructor is private.
- Use explicit return type declarations and type hints for all method parameters: `function isAccessible(User $user, ?string $path = null): bool`
- Use TitleCase for Enum keys: `FavoritePerson`, `BestLake`, `Monthly`.
- Prefer PHPDoc blocks over inline comments. Only add inline comments for exceptionally complex logic.
- Use array shape type definitions in PHPDoc blocks.

=== deployments rules ===

# Deployment

- Laravel can be deployed using [Laravel Cloud](https://cloud.laravel.com/), which is the fastest way to deploy and scale production Laravel applications.

=== sail rules ===

# Laravel Sail

- This project runs inside Laravel Sail's Docker containers. You MUST execute all commands through Sail.
- Start services using `vendor/bin/sail up -d` and stop them with `vendor/bin/sail stop`.
- Open the application in the browser by running `vendor/bin/sail open`.
- Always prefix PHP, Artisan, Composer, and Node commands with `vendor/bin/sail`. Examples:
    - Run Artisan Commands: `vendor/bin/sail artisan migrate`
    - Install Composer packages: `vendor/bin/sail composer install`
    - Execute Node commands: `vendor/bin/sail npm run dev`
    - Execute PHP scripts: `vendor/bin/sail php [script]`
- View all available Sail commands by running `vendor/bin/sail` without arguments.

=== tests rules ===

# Test Enforcement

- Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to make sure they pass.
- Run the minimum number of tests needed to ensure code quality and speed. Use `vendor/bin/sail artisan test --compact` with a specific filename or filter.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `vendor/bin/sail artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using `vendor/bin/sail artisan list` and check their parameters with `vendor/bin/sail artisan [command] --help`.
- If you're creating a generic PHP class, use `vendor/bin/sail artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `vendor/bin/sail artisan make:model --help` to check the available options.

## APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `vendor/bin/sail artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `vendor/bin/sail npm run build` or ask the user to run `vendor/bin/sail npm run dev` or `vendor/bin/sail composer run dev`.

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/sail bin pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/sail bin pint --test --format agent`, simply run `vendor/bin/sail bin pint --format agent` to fix any formatting issues.

=== pest/core rules ===

## Pest

- This project uses Pest for testing. Create tests: `vendor/bin/sail artisan make:test --pest {name}`.
- The `{name}` argument should not include the test suite directory. Use `vendor/bin/sail artisan make:test --pest SomeFeatureTest` instead of `vendor/bin/sail artisan make:test --pest Feature/SomeFeatureTest`.
- Run tests: `vendor/bin/sail artisan test --compact` or filter: `vendor/bin/sail artisan test --compact --filter=testName`.
- Do NOT delete tests without approval.

</laravel-boost-guidelines>

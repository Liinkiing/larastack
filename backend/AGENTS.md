# AGENTS.md
Operational guide for coding agents working in `backend/`.

## Scope and Precedence
- Applies to files under `backend/`.
- This file overrides root guidance for backend-specific choices.

## Stack
- Laravel 13
- Lighthouse GraphQL
- Laravel Sail
- PHP 8.5, Pest 5, PHPUnit 13, and Larastan 3

## Key Paths
- `app/Actions/` -> single-purpose business operations
- `app/Data/` -> typed transport/domain data objects
- `app/GraphQL/` -> application directives, queries, mutations, resolvers, and scalars
- `app/Http/` -> HTTP controllers, middleware, and requests
- `app/Models/`, `app/Policies/`, `app/Services/` -> persistence, authorization, and reusable infrastructure
- `graphql/` -> Lighthouse schema modules
- `tests/` -> Pest Unit/Feature suites running on PHPUnit
- `scripts/` -> backend maintenance helpers

## Setup and Runtime
Run from `backend/` unless otherwise noted.

- First install: if `vendor/bin/sail` is absent, follow the Composer bootstrap container step in `backend/README.md`; Sail cannot install itself.
- Install PHP deps after Sail exists: `./vendor/bin/sail composer install`
- Initialize the env file only when absent: `test -f .env || cp .env.example .env`
- Start services: `./vendor/bin/sail up -d`
- Generate the application key for a new environment only: `./vendor/bin/sail artisan key:generate` (rotating an existing key invalidates encrypted data and sessions).

## Commands
Run from repo root unless otherwise noted.

- Dev (Vite): `pnpm --filter @larastack/backend dev`
- Build (Vite): `pnpm --filter @larastack/backend build`
- Workers and scheduler: `pnpm --filter @larastack/backend workers:up`, `workers:down`, `workers:logs`, or `workers:reload` after starting Sail. Use `QUEUE_CONNECTION=redis` for local async jobs.
- Pail logs (via `artisan dev`): from `backend/`, `./vendor/bin/sail composer run dev`
- Check PHP formatting (Pint, Laravel preset): `pnpm --filter @larastack/backend lint`
- Fix PHP formatting: `pnpm --filter @larastack/backend lint:fix`
- Static analysis: `pnpm --filter @larastack/backend types:check`
- Full CI gate (Pint + PHPStan + Pest): `pnpm --filter @larastack/backend test:ci`
- Dependency security audit: from `backend/`, `./vendor/bin/sail composer audit --locked`
- Reset DB + seed: `pnpm --filter @larastack/backend db:reset`
- Dump GraphQL schema and sync client schema files: `pnpm --filter @larastack/backend gql:dump`

The PHP tooling flags live in `backend/composer.json` (`lint`, `lint:check`, `types:check`,
`test`, `ci:check`), mirroring the official Laravel skeleton and starter kits. The npm scripts
above are thin Sail wrappers around them, so change the flags in `composer.json` only.

### Pest (Sail)
Run these from `backend/`.

- All tests: `./vendor/bin/sail pest`
- Single file: `./vendor/bin/sail pest tests/Feature/ExampleTest.php`
- Filter by name: `./vendor/bin/sail pest --filter="health response"`
- Single suite: `./vendor/bin/sail pest --testsuite=Unit`

## Backend Standards
- Run PHP tooling commands (for example `composer`, `artisan`, `pest`) through Sail when available.
- Repository-specific exception to generated Sail guidance: run JavaScript workspace commands through root `pnpm --filter @larastack/backend ...`; do not run pnpm workspace tooling through Sail.
- Repository-specific guidance above overrides conflicting generated guidance below, especially the root pnpm/Sail exception.
- Do not run local cache/optimization commands such as `config:cache`, `route:cache`, `view:cache`, `event:cache`, or `optimize` during development/testing unless explicitly requested; these are deployment steps and can make local tests/config read stale values.
- If cache/optimization commands are explicitly needed for deployment validation, run `./vendor/bin/sail artisan optimize:clear`, `./vendor/bin/sail artisan lighthouse:clear-schema-cache`, and `./vendor/bin/sail artisan lighthouse:clear-query-cache` immediately after validation.
- PHP formatting uses Pint (Laravel preset) via Sail.
- `laravel/pao` rewrites Pest/PHPUnit/PHPStan and Artisan output to compact JSON whenever an
  agent is detected (`AI_AGENT`, `CLAUDECODE`, `CURSOR_AGENT`, ...). The JSON is the tool's real
  result, not a degraded view. Set `PAO_DISABLE=1` to get the human renderer back when you need
  Pest's code frames, and `PAO_FORCE=1` to see the agent output from a normal shell.
- Use Form Requests for validation/authorization.
- Prefer explicit return types in controllers/resolvers when practical.
- Prefer explicit imports over implicit aliases.
- Keep GraphQL schema descriptions clear and consistent.
- Prefer `final` for classes not designed for inheritance.
- Throw framework-appropriate exceptions for auth/validation/authorization failures.
- Keep logs structured and actionable; never log secrets.

## GraphQL and Client Sync
- After schema changes under `backend/graphql/**/*.graphql`, run `pnpm --filter @larastack/backend gql:dump`.
- `gql:dump` prints the Lighthouse schema, copies it into each existing client workspace, and runs that client's GraphQL codegen. Do not rerun the frontend/mobile generators unless debugging or regenerating client-only operation changes.
- The generated Boost block at the end of this file is derived from the installed backend
  dependencies. Refresh it after dependency changes with
  `./vendor/bin/sail artisan boost:update --no-interaction` rather than editing it by hand.
- Boost installs its skills into the workspace root at `<repo>/.agents/skills`, not into
  `backend/`, because agents only discover skills at the repository root. The paths and the
  `tailwindcss-development` exclusion live in `backend/config/boost.php`; the `../.agents`
  bind mount in `backend/docker-compose.yml` is what makes those paths resolve the same way
  inside Sail as they do on the host. Do not edit `boost.json`'s `skills` array by hand --
  Boost regenerates it from package discovery on every update.
- After Boost adds a new skill, mirror it for Claude Code the way every other skill in this
  repository is mirrored: `ln -s ../../.agents/skills/<name> .claude/skills/<name>` from the
  repository root.
- `backend/.ai/guidelines/*.md` still works normally: those fragments are composed into the
  Boost block of `backend/AGENTS.md` and `backend/CLAUDE.md`, which are correctly
  backend-scoped. Only skills were relocated to the workspace root.
- The Boost MCP server is wired for Claude Code in the workspace-root `.mcp.json`, mirroring the
  `laravel-boost` entry in `opencode.json`. Both shell out to
  `docker exec -i larastack-app-1 php /var/www/html/artisan boost:mcp`, so the Sail app container
  must be running (`./vendor/bin/sail up -d`) before the tools resolve. Keep that file by hand:
  `boost:install` would write `backend/.mcp.json`, which agents running from the repository root
  never read.
- Boost project rules are disabled (`rules.enabled => false` in `backend/config/boost.php`), so the
  `record-rule` MCP tool is not registered and the generated guidelines carry no `.ai/rules`
  section. The rule repository is hard-coded to the Laravel application root, so it would have
  written to `backend/.ai/rules/` while instructing agents to read `@.ai/rules/index.md` at the
  workspace root. Record durable backend decisions in this file instead.
- Do not author custom skills in `backend/.ai/skills`. Boost symlinks those into the skills
  path using a path relative to the application root, and the application root is
  `/var/www/html` inside Sail but `<repo>/backend` on the host, so the resulting link is
  broken on the host. Author skills directly in `<repo>/.agents/skills` like every other
  skill here.
- Never write the Boost block's opening marker tag inside this hand-written section:
  `boost:update` splits the file on the first literal occurrence of that tag and discards
  everything after it, so a prose mention silently truncates this guide.

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

## Foundational Context

This application is a Laravel application running on PHP 8.5. Always use the APIs that match the installed major version of each package — do not assume a version.

Before relying on a package's API, confirm its installed version:
- PHP packages: run `vendor/bin/sail composer show --direct` to list direct dependencies with versions, or `vendor/bin/sail composer show <vendor/package>` for a single package.
- JS packages: check `package.json` for the installed versions.

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

- If a frontend change doesn't show in the UI or you get a "Unable to locate file in Vite manifest" error, run `vendor/bin/sail npm run build` or ask the user to run `vendor/bin/sail npm run dev` or `vendor/bin/sail composer run dev`.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

=== boost rules ===

# Laravel Boost

## Tools

- Laravel Boost is an MCP server with tools designed specifically for this application. Prefer Boost tools over manual alternatives like shell commands or file reads.
- Use `database-query` to run read-only queries against the database instead of writing raw SQL in tinker.
- Use `database-schema` to inspect table structure before writing migrations or models.
- Use `get-absolute-url` to resolve the correct scheme, domain, and port for project URLs. Always use this before sharing a URL with the user.
- Use `browser-logs` to read browser logs, errors, and exceptions. Only recent logs are useful, ignore old entries.

## Searching Documentation (IMPORTANT)

- Use `search-docs` before changes that depend on Laravel ecosystem APIs, behavior, configuration, or version-specific syntax. Skip it for copy-only edits and other changes where package documentation is irrelevant. Reuse sufficient results already in context instead of searching again.
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

- Add or update tests for behavior and logic changes when a test provides meaningful regression coverage.
- Pure copy, styling, and layout-only changes do not require new or updated tests.
- When test coverage applies, run the affected tests and ensure they pass.
- Test the changed behavior and its important failure modes, but do not add tests beyond them.
- Read the `testing-best-practices` skill before writing tests.

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

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/sail bin pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/sail bin pint --test --format agent`, simply run `vendor/bin/sail bin pint --format agent` to fix any formatting issues.

=== pest/core rules ===

# Pest

- This project uses Pest. Create tests with `vendor/bin/sail artisan make:test --pest {name}`.
- Do not include the test suite directory in `{name}`. Use `SomeFeatureTest`, not `Feature/SomeFeatureTest`.
- Read the `testing-best-practices` skill for guidance on coverage, naming, structure, dependency isolation, and review.
- Do not delete tests or test files without approval. They are part of the application.

## Running Tests

- Run the narrowest set of tests that covers the change. Pass a file path or `--filter=testName` to `vendor/bin/sail artisan test --compact`.
- Rerun a test after each change to it.
- Run `vendor/bin/sail bin pest` to call the test runner directly. It accepts the same file path and `--filter=testName` arguments.

</laravel-boost-guidelines>

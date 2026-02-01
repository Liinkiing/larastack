# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. Follow these closely to enhance developer experience.

## Foundational Context

This application is a Laravel app and its main Laravel ecosystem packages and versions are below:

- php - 8.4.11
- laravel/framework (LARAVEL) - v12
- laravel/prompts (PROMPTS) - v0
- laravel/sanctum (SANCTUM) - v4
- laravel/socialite (SOCIALITE) - v5
- larastan/larastan (LARASTAN) - v3
- laravel/mcp (MCP) - v0
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- laravel/telescope (TELESCOPE) - v5
- phpunit/phpunit (PHPUNIT) - v11

## Conventions

- Follow existing code conventions. Check sibling files for structure, approach, and naming.
- Use descriptive names for variables and methods. Example: `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests already cover that functionality.

## Application Structure and Architecture

- Stick to existing directory structure; do not create new base folders without approval.
- Do not change dependencies without approval.

## Frontend Bundling

- If a frontend change is not reflected in the UI, the user may need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Replies

- Be concise; focus on what's important.

## Documentation Files

- Only create documentation files if explicitly requested by the user.

## Laravel Boost

- Laravel Boost is an MCP server with tools designed for this app. Use them.

## Laravel Sail

- Always use Sail commands instead of direct PHP/Composer commands.
- Use `./vendor/bin/sail artisan` instead of `php artisan`.
- Use `./vendor/bin/sail composer` instead of `composer`.
- Use `./vendor/bin/sail npm` instead of `npm` (when running inside containers).
- Use `./vendor/bin/sail pint` instead of `vendor/bin/pint`.
- Use `./vendor/bin/sail test` instead of `php artisan test`.
- Use `./vendor/bin/sail bin phpstan analyze` for static analysis.
- Any PHP/Composer/Node command should be prefixed with `./vendor/bin/sail` when working with this application.

## Artisan

- Use the `list-artisan-commands` tool when you need to call an Artisan command to double check the available parameters.
- Always use `./vendor/bin/sail artisan` for Artisan commands.

## URLs

- When sharing a project URL, use the `get-absolute-url` tool to ensure correct scheme, domain or IP, and port.

## Tinker and Debugging

- Use the `tinker` tool when you need to execute PHP to debug code or query Eloquent models directly.
- Use the `database-query` tool when you only need to read from the database.

## Reading Browser Logs With the `browser-logs` Tool

- Use the `browser-logs` tool to read browser logs, errors, and exceptions.
- Only recent browser logs are useful; ignore old logs.

## Searching Documentation (Critically Important)

- Use the `search-docs` tool before other approaches for Laravel ecosystem docs.
- Pass an array of packages to filter when you know the relevant packages.
- Use multiple, broad, simple, topic-based queries to start. Example: `['rate limiting', 'routing rate limiting', 'routing']`.
- Do not add package names to queries; package info is already shared.

### Available Search Syntax

1. Simple word searches with auto-stemming: `authentication`
2. Multiple words (AND logic): `rate limit`
3. Quoted phrases (exact position): `"infinite scroll"`
4. Mixed queries: `middleware "rate limit"`
5. Multiple queries: `queries=["authentication", "middleware"]`

## PHP

- Always use curly braces for control structures, even if it has one line.

### Constructors

- Use PHP 8 constructor property promotion in `__construct()`.
- Do not allow empty `__construct()` methods with zero parameters.

Example:

```php
public function __construct(public GitHub $github)
{
}
```

### Type Declarations

- Always use explicit return type declarations for methods and functions.
- Use appropriate PHP type hints for method parameters.

```php
protected function isAccessible(User $user, ?string $path = null): bool
{
    // ...
}
```

## Comments

- Prefer PHPDoc blocks over comments.
- Never use comments within the code itself unless there is something very complex going on.

## PHPDoc Blocks

- Add useful array shape type definitions for arrays when appropriate.

## Enums

- Keys in an Enum should be TitleCase. Example: `FavoritePerson`, `BestLake`, `Monthly`.

## Do Things the Laravel Way

- Use `./vendor/bin/sail artisan make:` commands to create new files.
- If creating a generic PHP class, use `./vendor/bin/sail artisan make:class`.
- Pass `--no-interaction` to all Artisan commands and include correct options.

### Database

- Use proper Eloquent relationship methods with return type hints.
- Use Eloquent models and relationships before suggesting raw database queries.
- Avoid `DB::`; prefer `Model::query()`.
- Prevent N+1 by using eager loading.
- Use the query builder for very complex database operations.

### Model Creation

- When creating new models, create useful factories and seeders too.
- Ask the user if they need other make options; use `list-artisan-commands` to check available options.

### APIs and Eloquent Resources

- For APIs, default to Eloquent API Resources and API versioning unless existing conventions say otherwise.

### Controllers and Validation

- Always create Form Request classes for validation rather than inline validation.
- Include validation rules and custom error messages.
- Check sibling Form Requests for array or string based rules.

### Queues

- Use queued jobs for time-consuming operations with the `ShouldQueue` interface.

### Authentication and Authorization

- Use Laravel's built-in authentication and authorization features.

### URL Generation

- Prefer named routes and the `route()` function.

### Configuration

- Use environment variables only in config files. Never call `env()` directly outside config.

### Testing

- For tests, use model factories and check for custom states.
- Use `$this->faker` or `fake()` based on existing conventions.
- Create tests with `./vendor/bin/sail artisan make:test [options] <name>`.
- Most tests should be feature tests; use `--unit` for unit tests.

### Vite Error

- If you see "Illuminate\\Foundation\\ViteException: Unable to locate file in Vite manifest", run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

## Laravel 12

- Use the `search-docs` tool for version-specific documentation.
- Laravel 12 uses a streamlined file structure.

### Laravel 12 Structure

- No middleware files in `app/Http/Middleware/`.
- `bootstrap/app.php` registers middleware, exceptions, and routing files.
- `bootstrap/providers.php` contains application-specific service providers.
- No `app/Console/Kernel.php`; use `bootstrap/app.php` or `routes/console.php`.
- Commands auto-register from `app/Console/Commands/`.

### Database

- When modifying a column, the migration must include all attributes previously defined on the column.
- Laravel 11+ allows limiting eagerly loaded records natively: `$query->latest()->limit(10);`.

### Models

- Casts can be set in a `casts()` method rather than the `$casts` property. Follow existing conventions.

## Laravel Pint Code Formatter

- Run `./vendor/bin/sail pint --dirty` before finalizing changes.
- Do not run `./vendor/bin/sail pint --test`; run `./vendor/bin/sail pint` to fix formatting.

## PHPStan / Larastan Static Analysis

- Run `./vendor/bin/sail bin phpstan analyze` before finalizing PHP changes.
- PHPStan is configured at level 6 in `phpstan.neon`.
- Fix errors; do not ignore type errors unless absolutely necessary and documented.
- Run PHPStan on specific paths you changed: `./vendor/bin/sail bin phpstan analyze app/Path/To/File.php`.

## PHPUnit Core

- Tests must be written as PHPUnit classes.
- Use `./vendor/bin/sail artisan make:test --phpunit <name>` to create new tests.
- If you see a test using Pest, convert it to PHPUnit.
- Every time a test has been updated, run that singular test.
- When tests are passing, ask the user if they want to run the entire test suite.
- Tests should cover happy paths, failure paths, and weird paths.
- Do not remove any tests or test files without approval.

### Running Tests

- Run the minimal number of tests, using an appropriate filter, before finalizing.
- Run all tests: `./vendor/bin/sail artisan test`.
- Run all tests in a file: `./vendor/bin/sail artisan test tests/Feature/ExampleTest.php`.
- Filter by test name: `./vendor/bin/sail artisan test --filter=testName`.

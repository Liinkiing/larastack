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

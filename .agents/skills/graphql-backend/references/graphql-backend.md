# GraphQL Backend Guidelines (Laravel Lighthouse)

These guidelines apply to all GraphQL schema and resolver files in the `backend` directory. This project uses Laravel Lighthouse for GraphQL API development.

## File Organization

```
backend/graphql/
├── schema.graphql      # Root schema with imports
├── types/              # Type definitions (User.graphql)
├── scalars/            # Custom scalars (DateTime.graphql, HTML.graphql)
├── interfaces/         # Shared interfaces (Timestampable.graphql)
└── enums/              # Enum definitions
```

## Type Definitions

Always document fields with description strings. Use Lighthouse directives for common patterns.

```graphql
type Quiz implements Timestampable {
  "The unique identifier of the quiz."
  id: ID! @globalId

  "Title of the quiz."
  title: String!

  "Description of the quiz."
  description: HTML

  "Cover image URI."
  coverUrl: URI @rename(attribute: "cover_url")

  "When the quiz was created."
  createdAt: DateTime! @rename(attribute: "created_at")

  "When the quiz was last updated."
  updatedAt: DateTime! @rename(attribute: "updated_at")
}
```

## Extending Query/Mutation

Extend root types in the same file as the type definition:

```graphql
extend type Query {
  activeQuizzes: [Quiz!]!
    @canModel(ability: "view", model: "App\\Models\\Quiz")
    @field(resolver: "App\\GraphQL\\Queries\\ActiveQuizzes")
}
```

```graphql
extend type Mutation {
  createQuiz(input: CreateQuizInput!): Quiz! @guard @field(resolver: "App\\GraphQL\\Mutations\\CreateQuiz")
}
```

## Common Directives

| Directive                          | Usage                              |
| ---------------------------------- | ---------------------------------- |
| `@globalId`                        | Relay-compliant global IDs         |
| `@rename(attribute: "snake_case")` | Map camelCase to snake_case        |
| `@guard`                           | Require authentication             |
| `@auth`                            | Inject authenticated user          |
| `@canModel(ability, model)`        | Policy authorization               |
| `@field(resolver: "...")`          | Custom resolver class              |
| `@private`                         | Hide field from unauthorized users |

## Resolvers

Place in `app/GraphQL/Queries/` or `app/GraphQL/Mutations/`. Use invokable classes:

```php
<?php

namespace App\GraphQL\Queries;

use App\Models\Quiz;
use Illuminate\Database\Eloquent\Collection;

final class ActiveQuizzes
{
    /**
     * @return Collection<int, Quiz>
     */
    public function __invoke(): Collection
    {
        return Quiz::active()->get();
    }
}
```

## Schema Sync

After any GraphQL schema changes, sync to frontend:

```bash
cd backend && pnpm run gql:dump
```

This prints the schema, copies it to `frontend/schema.graphql`, and runs frontend codegen.

## Checklist

- All fields have documentation strings
- Using `@rename` for snake_case model attributes
- Using `@globalId` on ID fields
- Authorization via `@guard`, `@canModel`, or `@private`
- Ran `pnpm run gql:dump` after changes

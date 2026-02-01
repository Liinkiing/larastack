# GraphQL Frontend Guidelines

These guidelines apply to all GraphQL usage in the `frontend` directory. This project uses Apollo Client with GraphQL Codegen and colocated fragments (Relay-style conventions).

## Core Principles

- Colocate fragments: Every component that renders GraphQL data declares its own fragment in the same file
- One query per page: Next.js pages have one query spreading all child fragments
- Use useSuspenseQuery: Loading states handled by `loading.tsx`, not inline
- Data masking enforced: Components only access data declared in their fragment
- Custom useFragment hook: Always use `~/shared/hooks` version

## Colocated Fragments (Relay Convention)

Components should only access data declared in their fragment and never receive fields beyond what the fragment specifies.

Fragment naming: `{ComponentName}_{typeName}`

```tsx
import type { FC } from 'react'
import type { FragmentType } from '~/__generated__/gql'
import { graphql } from '~/__generated__/gql'
import { useFragment } from '~/shared/hooks'

const fragment = graphql(`
  fragment ActiveQuizCard_quiz on Quiz {
    id
    title
    description
  }
`)

interface Props {
  quiz: FragmentType<typeof fragment>
}

export const ActiveQuizCard: FC<Props> = ({ quiz: quizFragment }) => {
  const quiz = useFragment({ fragment, from: quizFragment })
  return <div>{quiz.title}</div>
}
```

### Key Rules

- Fragment names must be globally unique and prefixed with component name
- Use `FragmentType<typeof fragment>` for prop typing (enforces data masking)
- Always use custom `useFragment` hook from `~/shared/hooks`
- Every field in a fragment must be used by the component (no ghost fields)
- Do not share fragments between components; each component owns its data requirements

## Page-Level Queries

Each Next.js page should have one query that spreads all child fragments. Parent queries compose child fragments and never duplicate field selections.

```tsx
'use client'

import { useSuspenseQuery } from '@apollo/client/react'
import { graphql } from '~/__generated__/gql'
import { HomeQueryDocument } from '~/__generated__/gql/graphql'

graphql(`
  query HomeQuery {
    activeQuizzes {
      id
      ...ActiveQuizCard_quiz
    }
  }
`)

export default function Home() {
  const { data } = useSuspenseQuery(HomeQueryDocument)
  return data.activeQuizzes.map(quiz => <ActiveQuizCard key={quiz.id} quiz={quiz} />)
}
```

### Key Rules

- Use `useSuspenseQuery` (not `useQuery`); loading handled by `loading.tsx`
- Always include `'use client'` directive
- Always include `id` field on entities with fragment spreads
- Import generated document types from `~/__generated__/gql/graphql`

## Loading States

Handle loading via Next.js `loading.tsx` file; no inline loading states.

```tsx
// app/(public)/loading.tsx
export default function Loading() {
  return <LoadingSpinner />
}
```

```tsx
// Bad: inline loading
const { data, loading } = useQuery(...)
if (loading) return <LoadingSpinner />
```

## Import Patterns

```tsx
import { graphql } from '~/__generated__/gql'
import type { FragmentType } from '~/__generated__/gql'
import { SomeQueryDocument } from '~/__generated__/gql/graphql'
import { useSuspenseQuery, useMutation } from '@apollo/client/react'
import { useFragment } from '~/shared/hooks'
```

## Mutations

Return minimal fields and use fragment spreads for cache updates:

```tsx
import { useMutation } from '@apollo/client/react'
import { graphql } from '~/__generated__/gql'
import { CreateQuizDocument } from '~/__generated__/gql/graphql'

graphql(`
  mutation CreateQuiz($input: CreateQuizInput!) {
    createQuiz(input: $input) {
      id
      ...ActiveQuizCard_quiz
    }
  }
`)

const [createQuiz] = useMutation(CreateQuizDocument)
```

## Code Generation

Run after any GraphQL changes:

```bash
cd frontend && pnpm run gen:gql
```

## Checklist

- Fragment colocated with component (naming: `ComponentName_typeName`)
- Every fragment field is used by the component
- Page query spreads all child fragments
- Using `useSuspenseQuery` plus `loading.tsx` for loading states
- Using custom `useFragment` from `~/shared/hooks`
- Ran `pnpm run gen:gql` after changes

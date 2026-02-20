# GraphQL Frontend Guidelines

These guidelines apply to all GraphQL usage in the `frontend` and `mobile` directories. This project uses Apollo Client with GraphQL Codegen and colocated operations.

## Core Principles

- Colocate operations/fragments: Keep queries, mutations, and fragments in the file that owns the UI behavior
- Compose at screen/page level: Next.js pages and Expo screens should compose child data needs
- Prefer suspense-ready hooks when the app architecture supports them
- Data masking enforced where enabled: Components only access declared fields
- Keep generated documents/types from `~/__generated__/gql/graphql`

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

## Page/Screen-Level Queries

Each Next.js page or Expo screen should own its query and compose child fragments/fields without duplicating responsibilities.

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

- Use `useSuspenseQuery` when using suspense boundaries; otherwise use `useQuery` with explicit loading states
- In Next.js client components, include `'use client'` directive
- Always include `id` field on entities with fragment spreads
- Import generated document types from `~/__generated__/gql/graphql`

## Loading States

Handle loading according to app runtime:

- Next.js: prefer route `loading.tsx`
- Expo mobile: if using `useSuspenseQuery`, wrap the route/layout subtree in `<Suspense fallback={...}>`
- Expo mobile: use a themed full-screen fallback (for example background color + centered `ActivityIndicator`) to avoid blank/black transitions

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

## Apollo Client 4 Types

Apollo Client 4 deprecates many legacy exported type aliases (for example `MutationHookOptions`, `QueryHookOptions`).

- Prefer namespaced hook types directly from the hook function namespace
- Example: `useMutation.Options<TData, TVariables>` instead of `MutationHookOptions<TData, TVariables>`
- Keep importing hooks from `@apollo/client/react`

## Mutations

Use dedicated mutation hook files under `~/apollo/mutations/MutationName.ts`.

- Keep the GraphQL document and generated document import in that file
- Export a `useMutationName` hook that wraps `useMutation`
- Default to `notifyOnNetworkStatusChange: true`
- Add a `map...ValuesToInput` helper only when the mutation has meaningful input mapping
- For no-input mutations, skip the mapper and expose only the hook

Template:

```tsx
import { useMutation } from '@apollo/client/react'

import { graphql } from '~/__generated__/gql'
import type { MutationNameMutation, MutationNameMutationVariables } from '~/__generated__/gql/graphql'
import { MutationNameDocument } from '~/__generated__/gql/graphql'

graphql(`
  mutation MutationName($input: MutationInput!) {
    mutationName(input: $input) {
      id
      # relevant fields for cache updates
    }
  }
`)

export const mapMutationNameValuesToInput = (
  values: ValuesFromAForm,
): MutationNameMutationVariables['input'] => {
  return {
    // map values to GraphQL input
  }
}

export const useMutationName = (
  options?: useMutation.Options<MutationNameMutation, MutationNameMutationVariables>,
) => {
  return useMutation(MutationNameDocument, {
    notifyOnNetworkStatusChange: true,
    ...options,
  })
}
```

No-input template:

```tsx
import { useMutation } from '@apollo/client/react'

import { graphql } from '~/__generated__/gql'
import type { FinishOnboardingMutation, FinishOnboardingMutationVariables } from '~/__generated__/gql/graphql'
import { FinishOnboardingDocument } from '~/__generated__/gql/graphql'

graphql(`
  mutation FinishOnboarding {
    finishOnboarding {
      id
    }
  }
`)

export const useFinishOnboarding = (
  options?: useMutation.Options<FinishOnboardingMutation, FinishOnboardingMutationVariables>,
) => {
  return useMutation(FinishOnboardingDocument, {
    notifyOnNetworkStatusChange: true,
    ...options,
  })
}
```

## Code Generation

Run after any GraphQL changes:

```bash
pnpm --filter @larastack/frontend gen:gql
pnpm --filter @larastack/mobile gen:gql
```

## Checklist

- Fragment colocated with component (naming: `ComponentName_typeName`)
- Every fragment field is used by the component
- Page query spreads all child fragments
- Mutation hooks live in `~/apollo/mutations/MutationName.ts`
- Using `useSuspenseQuery` plus `loading.tsx` for loading states
- Using custom `useFragment` from `~/shared/hooks`
- Ran `pnpm run gen:gql` after changes

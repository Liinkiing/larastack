---
name: graphql-frontend
description: Apollo Client GraphQL conventions for frontend/ and mobile/ with colocated operations and codegen. Use when editing GraphQL queries, mutations, or fragments in the Next.js or Expo apps.
---

# Graphql Frontend

## Overview

Follow the project's Apollo Client GraphQL conventions for both Next.js frontend and Expo mobile apps.

## Guidelines

- Read `references/graphql-frontend.md` before editing GraphQL usage.
- Apply the conventions to files under `frontend/` and `mobile/` GraphQL usage.
- Prefer mutation hooks in `~/apollo/mutations/MutationName.ts` for reusable mutation logic.
- Use Apollo Client 4 namespaced hook types (for example `useMutation.Options`) instead of deprecated legacy aliases.
- After GraphQL changes, run the documented codegen commands for impacted apps.

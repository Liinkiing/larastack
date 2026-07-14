# AGENTS.md

Operational guide for coding agents working in `frontend/`.

## Scope and Precedence

- Applies to files under `frontend/`.
- This file overrides root guidance for frontend-specific choices.

## Stack

- Next.js 16 App Router
- React 19 with React Compiler enabled
- Apollo Client 4 with runtime data masking
- Panda CSS 1 and Storybook 10
- Vitest 4

## Key Paths

- `app/` -> App Router pages/layouts and route-local components (use a local `_components/` folder when extraction is useful)
- `src/apollo/` -> Apollo client setup and GraphQL helpers
- `src/__generated__/` -> generated GraphQL output; do not edit by hand
- `src/styled-system/` -> generated Panda CSS output; do not edit by hand
- `src/ui/` -> shared UI primitives
- `src/theme/` -> design tokens and theme setup
- `src/shared/` -> reusable shared utilities

## Commands

Run from repo root.

- Dev: `pnpm --filter @larastack/frontend dev`
- Build: `pnpm --filter @larastack/frontend build`
- Start: `pnpm --filter @larastack/frontend start`
- Typecheck: `pnpm --filter @larastack/frontend ts:check`
- Pre-typecheck pipeline: `pnpm --filter @larastack/frontend prets:check`
- Test: `pnpm --filter @larastack/frontend test`
- Test (CI): `pnpm --filter @larastack/frontend test:ci`
- Test (watch): `pnpm --filter @larastack/frontend test:watch`
- Lint: `pnpm --filter @larastack/frontend lint`
- Lint fix: `pnpm --filter @larastack/frontend lint:fix`
- Format: `pnpm --filter @larastack/frontend format`
- Format check: `pnpm --filter @larastack/frontend format:check`
- GraphQL codegen: `pnpm --filter @larastack/frontend gen:gql`
- GraphQL codegen watch: `pnpm --filter @larastack/frontend gen:gql:watch`
- Panda codegen: `pnpm --filter @larastack/frontend gen:panda`
- Storybook: `pnpm --filter @larastack/frontend storybook`
- Storybook build: `pnpm --filter @larastack/frontend build-storybook`

## Frontend Standards

- Use type-only imports in TypeScript (`import type { X } from '...'`).
- Keep import groups ordered: framework -> third-party -> generated -> internal.
- Aliases:
  - `~/*` -> `frontend/src/*`
  - `~app/*` -> `frontend/app/*`
- Keep strict typing; avoid new `any` unless unavoidable.
- Prefer `unknown` for caught errors and narrow before use.
- Add explicit return types for shared utilities/hooks/services.
- Next.js App Router defaults to Server Components; add `'use client'` only when required.
- Co-locate route-specific UI in `app/`; keep reusable UI in shared directories.
- React Compiler is enabled; avoid defensive `useMemo`, `useCallback`, and `memo` unless identity is required for correctness or profiling proves a benefit.
- Public `NEXT_PUBLIC_*` values are embedded in browser bundles. Never place secrets in them or in the tracked frontend `.env` defaults.

## GraphQL Workflow

- After operation/fragment changes in `app/**/*.ts(x)` or `src/**/*.ts(x)`, run `pnpm --filter @larastack/frontend gen:gql`.
- If backend schema changed and `backend/` exists, run `pnpm --filter @larastack/backend gql:dump` first.
- Apollo runtime data masking is authoritative. Keep Codegen's own fragment masking disabled, consume fragments with Apollo's `useFragment`, and use `@unmask` only when a caller intentionally needs fragment fields inline.
- Treat `src/__generated__/` and `src/styled-system/` as generated output; change their source configuration or schema and regenerate instead of patching generated files.

## Type Checking and Tests

- `ts:check` uses the native TypeScript 7 compiler; TypeScript 6 remains installed for tools that have not adopted the native compiler. Validate codegen, Next.js, Storybook, and Vitest before changing that split.
- Add focused Vitest tests beside testable utilities and behavior. `test:ci` is the non-watch validation command.
- Test React component behavior with React Testing Library and user-visible queries. Use direct React DOM APIs only for renderer-level fixtures such as producing server HTML for an explicit hydration test.

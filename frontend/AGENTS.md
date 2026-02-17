# AGENTS.md

Operational guide for coding agents working in `frontend/`.

## Scope and Precedence

- Applies to files under `frontend/`.
- This file overrides root guidance for frontend-specific choices.

## Stack

- Next.js 16 App Router
- Apollo Client
- Panda CSS

## Key Paths

- `app/` -> route-local App Router pages/layouts/components
- `src/apollo/` -> Apollo client setup and GraphQL helpers
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
- Lint: `pnpm --filter @larastack/frontend lint`
- Lint fix: `pnpm --filter @larastack/frontend lint:fix`
- Format: `pnpm --filter @larastack/frontend format`
- Format check: `pnpm --filter @larastack/frontend format:check`
- GraphQL codegen: `pnpm --filter @larastack/frontend gen:gql`
- GraphQL codegen watch: `pnpm --filter @larastack/frontend gen:gql:watch`
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

## GraphQL Workflow

- After operation/fragment changes in `app/**/*.ts(x)` or `src/**/*.ts(x)`, run `pnpm --filter @larastack/frontend gen:gql`.
- If backend schema changed and `backend/` exists, run `pnpm --filter @larastack/backend gql:dump` first.

---
name: uniwind-ui-components
description: Create reusable React Native UI components with Uniwind and tailwind-variants, including typed variant APIs, slot-based compound components (for example Card.Root, Card.Header, Card.Body, Card.Footer), and theme/platform-aware styling. Use when building or refactoring components in mobile/src/ui, designing variant systems, migrating dynamic class logic to tv/cn, or composing multi-part components.
---

# Uniwind UI Components

## Overview

Build reusable, polished mobile UI components using Uniwind `className` styling and `tailwind-variants` (`tv`, `cn`, `VariantProps`).
Prefer static, token-driven classes and strongly typed variant contracts.

## Read First

- Read `references/uniwind-rules.md` for Uniwind behavior and constraints.
- Read `references/tv-patterns.md` for `tv` patterns, slots, and compound components.

## Workflow

1. Choose component shape:
   - Single-part component: one `tv({ base, variants, compoundVariants, defaultVariants })`
   - Compound component: `tv({ slots, variants, compoundVariants, compoundSlots })` + `Component.Root/Header/Body/Footer`
2. Define semantic variants (`variant`, `size`, `tone`, `state`) and add `defaultVariants`.
3. Treat `defaultVariants` as the single source of truth for defaults; do not duplicate defaults in prop destructuring or context initial values.
4. Type props with `VariantProps<typeof styles>` and extend React Native props for each slot.
5. Keep classes static and explicit; avoid string interpolation in class names.
6. Follow mobile conventions: component folder in kebab-case, PascalCase component file, local `index.ts` barrel.
7. Validate with:
   - `pnpm --filter @larastack/mobile lint`
   - `pnpm --filter @larastack/mobile ts:check`

## Output Expectations

- Expose a minimal, predictable API with typed variants and sensible defaults.
- Keep defaults centralized in `tv(...defaultVariants)`; allow `undefined` variant values to flow through context/props.
- Prefer slot composition over deeply nested conditional class logic.
- Keep visual hierarchy intentional (spacing, contrast, radius, elevation) and consistent with project tokens.
- Avoid ad-hoc one-off styles when a reusable variant/slot belongs in the component contract.

## References

- Uniwind rules and caveats: `references/uniwind-rules.md`
- Tailwind-variants component patterns: `references/tv-patterns.md`

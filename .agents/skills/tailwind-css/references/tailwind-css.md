# Tailwind CSS Styling Guidelines

These guidelines apply to frontend TypeScript and TSX files.

## Core Principles

- Use Tailwind CSS 4 utilities for styling.
- Use `frontend/app/index.css` for theme tokens, CSS variables, keyframes, and base styles.
- Use `tailwind-variants` for reusable component APIs with variants.
- Use `cn()` from `~/tailwind-variants` whenever combining default classes with `className`.
- Prefer semantic tokens such as `bg-surface`, `text-muted`, `border-border-subtle`, and `font-display`.
- Avoid inline styles unless a runtime value cannot be represented as a class.
- Do not add generated styling systems or CSS-in-JS runtimes.

## Styling Priority

1. Plain Tailwind `className` for page layout and local composition.
2. `tv()` variants for reusable UI components.
3. CSS tokens or utilities in `frontend/app/index.css` when a repeated semantic value is missing.
4. Inline styles only for dynamic values that cannot be represented by static classes.

## Reusable Component Pattern

```tsx
import type { ComponentProps } from 'react'

import { cn, tv, type VariantProps } from '~/tailwind-variants'

const cardStyles = tv({
  base: 'rounded-[24px] border border-border-subtle bg-surface p-5',
  variants: {
    tone: {
      neutral: '',
      accent: 'border-accent bg-accent-soft',
    },
  },
  defaultVariants: {
    tone: 'neutral',
  },
})

type CardProps = ComponentProps<'div'> & VariantProps<typeof cardStyles>

export function Card({ className, tone, ...props }: CardProps) {
  return <div className={cn(cardStyles({ tone }), className)} {...props} />
}
```

## Formatting

Tailwind class sorting is handled by Oxfmt. Root `.oxfmtrc.json` enables `sortTailwindcss` for `frontend/**/*`, points to `frontend/app/index.css`, and sorts classes inside `clsx`, `cn`, `cva`, and `tv`.

Run:

```bash
pnpm --filter @larastack/frontend format
pnpm --filter @larastack/frontend lint
pnpm --filter @larastack/frontend ts:check
```

# Ark UI Component Guidelines

Use Ark UI for headless component logic and Tailwind CSS for styling. Shared reusable component styles should use `tailwind-variants` through `~/tailwind-variants`.

## Core Principles

- Use Ark UI MCP tools first for component composition, props, and examples.
- Keep behavior in Ark UI primitives and styling in Tailwind class strings or `tv()` variants.
- Use compound namespace exports for multi-part components.
- Use `Root` by default; `RootProvider` only for hook-based control.
- Use `asChild` for trigger components with semantic components such as `Button` and `AppLink`.
- Merge consumer classes with `cn()` so overrides are deterministic.

## MCP Tools Workflow

1. `mcp_ark-ui_list_components` - Check available components.
2. `mcp_ark-ui_get_component_props` - Get exact subcomponent names and props.
3. `mcp_ark-ui_list_examples` + `mcp_ark-ui_get_example` - Get implementation examples.
4. `mcp_ark-ui_styling_guide` - Get data attributes for styling.

## Component Structure

```text
component-name/
  styled.tsx    # Ark UI + Tailwind variants
  index.ts      # Namespace exports
```

## Compound Component Pattern

```tsx
'use client'

import { ComponentName as ArkComponentName } from '@ark-ui/react/component-name'
import type { ComponentProps } from 'react'

import { cn, tv, type VariantProps } from '~/tailwind-variants'

const componentNameStyles = tv({
  slots: {
    root: 'relative flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface p-4',
    trigger: 'inline-flex items-center justify-center',
    content: 'rounded-2xl border border-border-subtle bg-surface p-4 shadow-soft',
  },
})

type RootProps = ComponentProps<typeof ArkComponentName.Root> & VariantProps<typeof componentNameStyles>
type TriggerProps = ComponentProps<typeof ArkComponentName.Trigger>
type ContentProps = ComponentProps<typeof ArkComponentName.Content>

export function Root({ className, ...props }: RootProps) {
  const styles = componentNameStyles()

  return <ArkComponentName.Root className={cn(styles.root(), className)} {...props} />
}

export function Trigger({ className, ...props }: TriggerProps) {
  const styles = componentNameStyles()

  return <ArkComponentName.Trigger className={cn(styles.trigger(), className)} {...props} />
}

export function Content({ className, ...props }: ContentProps) {
  const styles = componentNameStyles()

  return <ArkComponentName.Content className={cn(styles.content(), className)} {...props} />
}

export const RootProvider = ArkComponentName.RootProvider
export type ComponentNameProps = RootProps

// index.ts
export type { ComponentNameProps } from './styled'
export * as ComponentName from './styled'
```

## Simple Component Pattern

```tsx
'use client'

import { ark } from '@ark-ui/react/factory'
import type { ComponentProps } from 'react'

import { cn, tv, type VariantProps } from '~/tailwind-variants'

const componentNameStyles = tv({
  base: 'inline-flex items-center justify-center rounded-full font-semibold transition-colors',
  variants: {
    size: {
      sm: 'h-8 px-3 text-body-sm',
      md: 'h-10 px-4 text-body-md',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

type ComponentNameProps = ComponentProps<typeof ark.button> & VariantProps<typeof componentNameStyles>

export function ComponentName({ className, size, ...props }: ComponentNameProps) {
  return <ark.button className={cn(componentNameStyles({ size }), className)} {...props} />
}
```

## Rules

- Use exact subcomponent names from `mcp_ark-ui_get_component_props`.
- Always export props types for public components.
- Include `'use client'` in component files using Ark UI primitives.
- Style states through Tailwind data selectors from the Ark styling guide, for example `data-[state=open]:...`.
- Prefer tokens defined in `frontend/app/index.css`; avoid raw hex values unless adding a new token first.
- Do not introduce a second styling runtime or generated style system.

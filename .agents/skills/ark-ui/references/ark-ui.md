# Ark UI Component Guidelines

Always use Ark UI for headless component logic paired with Panda CSS recipes for styling. Use MCP tools to discover components, composition, examples, and props before implementing.

## Core Principles

- Use Ark UI MCP tools first for component composition and props
- Pair with Panda CSS recipes: slot recipes for compound components, regular recipes for simple components
- Use `createStyleContext` for compound components with subcomponents; use `styled()` for simple components
- Use `Root` by default; `RootProvider` only for hook-based control
- Use `asChild` for trigger components with semantic components (Button, Link, etc.)

## MCP Tools Workflow

1. `mcp_ark-ui_list_components` - Check available components
2. `mcp_ark-ui_get_component_props` - Get exact subcomponent names and props
3. `mcp_ark-ui_list_examples` + `mcp_ark-ui_get_example` - Get implementation examples
4. `mcp_ark-ui_styling_guide` - Get data attributes for styling

## Component Structure

```
component-name/
  ├── styled.tsx    # Ark UI + Panda CSS recipes
  └── index.ts      # Namespace exports
```

### Compound Component Pattern

```tsx


import { ComponentName as ArkComponentName } from '@ark-ui/react/component-name'
import type { ComponentProps } from 'react'

import { createStyleContext } from '~/styled-system/jsx'
import { componentName } from '~/styled-system/recipes'

const { withProvider, withContext } = createStyleContext(componentName)

export const Root = withProvider(ArkComponentName.Root, 'root')
export const RootProvider = withContext(ArkComponentName.RootProvider, 'rootProvider')
export const SubComponent = withContext(ArkComponentName.SubComponent, 'subComponent')

export type ComponentNameProps = ComponentProps<typeof Root>
export type ComponentNameSubComponentProps = ComponentProps<typeof SubComponent>

// index.ts
export type { ComponentNameProps, ComponentNameSubComponentProps } from './styled'
export * as ComponentName from './styled'
```

### Simple Component Pattern

```tsx


import { ark } from '@ark-ui/react/factory'
import { styled } from '~/styled-system/jsx'
import { componentName } from '~/styled-system/recipes'
import type { ComponentProps } from '~/styled-system/types'

export type ComponentNameProps = ComponentProps<typeof ComponentName>
export const ComponentName = styled(ark.button, componentName)

// index.ts
export type { ComponentNameProps } from './styled'
export { ComponentName } from './styled'
```

Note: Simple components use `ark.button`, `ark.input`, etc. from `@ark-ui/react/factory`. They do not have `.Root`.

## Recipe Patterns

Use theme tokens; check `mcp_panda_get_semantic_tokens` for available tokens.

### Slot Recipe (Compound Components)

```tsx
import { defineSlotRecipe } from '@pandacss/dev'

export const componentRecipe = defineSlotRecipe({
  className: 'component',
  slots: ['root', 'subComponent'],
  base: {
    root: { display: 'flex', padding: 4 },
    subComponent: { color: 'text' },
  },
  variants: {
    size: {
      sm: { root: { padding: 2 } },
      md: { root: { padding: 4 } },
    },
  },
  defaultVariants: { size: 'md' },
})

// Export in src/theme/recipes/index.ts
export const slotRecipes = {
  component: componentRecipe,
}
```

### Regular Recipe (Simple Components)

```tsx
import { defineRecipe } from '@pandacss/dev'

export const componentRecipe = defineRecipe({
  className: 'component',
  jsx: ['Component'],
  base: {
    display: 'flex',
    padding: 3,
    fontSize: 'body.md',
    color: 'text',
  },
  variants: {
    size: {
      sm: { padding: 2 },
      md: { padding: 3 },
    },
  },
})
```

## Critical Rules

### 1. Use Exact Subcomponent Names

Always use exact names from `mcp_ark-ui_get_component_props`. Match slot names exactly (camelCase).

### 2. Root vs RootProvider

- Use `Root` for standard usage
- Use `RootProvider` only when using hooks like `useDialog` or `useMenu`
- Always export both, but default to `Root`

### 3. Use `asChild` for Triggers

```tsx
// Good
<Dialog.Trigger asChild>
  <Button>Open</Button>
</Dialog.Trigger>

// Bad
<Dialog.Trigger>
  <Box as="button">Open</Box>
</Dialog.Trigger>
```

### 4. Always Export Types

Export TypeScript types for all component props.

### 5. Use Theme Tokens

- Spacing: `0`, `1`, `2`, `4`, `8`, etc.
- Sizes: `full` (not `100%`)
- Colors: token names (not hex or rgb)
- Check `mcp_panda_get_recipes` before creating new recipes

## Complete Examples

### Dialog (Compound Component)

```tsx


import { Dialog as ArkDialog } from '@ark-ui/react/dialog'
import type { ComponentProps } from 'react'
import { createStyleContext } from '~/styled-system/jsx'
import { dialog } from '~/styled-system/recipes'

const { withProvider, withContext } = createStyleContext(dialog)

export const Root = withProvider(ArkDialog.Root, 'root')
export const RootProvider = withContext(ArkDialog.RootProvider, 'rootProvider')
export const Trigger = withContext(ArkDialog.Trigger, 'trigger')
export const Content = withContext(ArkDialog.Content, 'content')
export const Title = withContext(ArkDialog.Title, 'title')
export const Description = withContext(ArkDialog.Description, 'description')
export const CloseTrigger = withContext(ArkDialog.CloseTrigger, 'closeTrigger')

export type DialogProps = ComponentProps<typeof Root>
```

```tsx
import { Dialog } from '~/ui/dialog'
import { Button } from '~/ui/button'
;<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button>Open</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Title</Dialog.Title>
    <Dialog.Description>Description</Dialog.Description>
    <Dialog.CloseTrigger asChild>
      <Button>Close</Button>
    </Dialog.CloseTrigger>
  </Dialog.Content>
</Dialog.Root>
```

### Button (Simple Component)

```tsx


import { ark } from '@ark-ui/react/factory'
import { styled } from '~/styled-system/jsx'
import { button } from '~/styled-system/recipes'
import type { ComponentProps } from '~/styled-system/types'

export type ButtonProps = ComponentProps<typeof Button>
export const Button = styled(ark.button, button)
```

## Quick Reference

Do:

- Use MCP tools to discover components first
- Use `Root` for standard usage
- Use `asChild` with Button or Link for triggers
- Use exact subcomponent names from Ark UI
- Use theme tokens for spacing, colors, and sizes
- Export types for all props

Don't:

- Use `RootProvider` unless you need hook-based control
- Use generic placeholders; use exact names
- Use `Box as="button"` instead of `asChild` with Button
- Use `createStyleContext` for simple components
- Skip MCP tools
- Create recipes without checking if they exist

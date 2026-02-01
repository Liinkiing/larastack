# Panda CSS Styling Guidelines

These guidelines apply to all TypeScript and TSX files in the `frontend` directory. Always use Panda CSS for styling; never use inline styles, CSS modules, or other styling solutions.

## Foundational Context

This application uses Panda CSS as the exclusive styling solution. Use MCP tools to discover available tokens, recipes, patterns, and variants before writing styles.

## Core Principles

- Always use Panda CSS; never use inline styles, CSS modules, styled-components, or other solutions
- Prefer prop-based styling on Panda components (`<Box backgroundColor="..." />`) whenever possible
- When setting a single color, prefer `backgroundColor` over `background`
- Before using tokens, first check the Panda MCP tools for available tokens/recipes/patterns. If the MCP tools are unavailable or return errors, proceed with the best judgment anyway.
- Avoid over-componentizing small layout-only blocks; duplication is acceptable when it improves clarity
- Prefer config recipes when available
- Use semantic tokens over raw color values
- Check available resources using MCP tools before writing styles

## Styling Priority Order

1. Component props on Panda components (e.g. `Box`, `Stack`, `Grid`)
1. Config recipes
1. Patterns
1. `css()` function (only when props/recipes/patterns are insufficient)
1. `styled()` components (prefer props + composition before creating new styled wrappers)

## Config Recipes

### Discovering Available Recipes

Check with `mcp_panda_get_recipes` to see available recipes, variants, and usage.

### Using Recipes

```tsx
import { styled } from '~/styled-system/jsx'
import { button } from '~/styled-system/recipes'
import type { ComponentProps } from '~/styled-system/types'

export type ButtonProps = ComponentProps<typeof Button>
export const Button = styled('button', button)

// Usage
<Button size="md">Click me</Button>
```

### Using Recipe Variants

Use the variants shown by `mcp_panda_get_recipes`.

### Creating New Recipes

```tsx
// src/theme/recipes/card.ts
import { defineRecipe } from '@pandacss/dev'

export const cardRecipe = defineRecipe({
  className: 'card',
  jsx: ['Card'],
  base: {
    padding: 4,
    borderRadius: 'lg',
    backgroundColor: 'white',
    boxShadow: 'md',
  },
  variants: {
    size: {
      sm: { padding: 2 },
      md: { padding: 4 },
      lg: { padding: 6 },
    },
    variant: {
      outlined: {
        border: '1px solid',
        borderColor: 'gray.200',
        boxShadow: 'none',
      },
      elevated: {
        boxShadow: 'lg',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'elevated',
  },
})
```

Export in `src/theme/recipes/index.ts`:

```tsx
import { cardRecipe } from '~/theme/recipes/card'

export const recipes = {
  // ... existing recipes
  card: cardRecipe,
}
```

### Regenerating Panda CSS After Recipe Changes

After creating, updating, or removing a recipe, run:

```bash
pnpm --filter="frontend" run gen:panda
```

Run this after:

- Creating a new recipe
- Modifying an existing recipe
- Removing a recipe
- Updating recipe exports in `src/theme/recipes/index.ts`

## Patterns

### Discovering Available Patterns

Use `mcp_panda_get_patterns` to discover available patterns and props.

### Using Patterns

```tsx
import { VStack, HStack, Box, Grid } from '~/styled-system/jsx'

<VStack gap={4} align="stretch">
  <Box>Item 1</Box>
  <Box>Item 2</Box>
</VStack>

<HStack gap={2} justify="space-between">
  <Button>Cancel</Button>
  <Button>Save</Button>
</HStack>

<Grid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
  <Box>Card 1</Box>
  <Box>Card 2</Box>
  <Box>Card 3</Box>
</Grid>
```

## CSS Function

Use `css()` for one-off styles or when recipes and patterns do not fit:

```tsx
import { css } from '~/styled-system/css'

const containerStyles = css({
  padding: 4,
  backgroundColor: 'gray.50',
  borderRadius: 'lg',
  _hover: {
    backgroundColor: 'gray.100',
  },
})

<div className={containerStyles}>Content</div>
```

### Using with Styled Components

```tsx
import { styled } from '~/styled-system/jsx'
import { css } from '~/styled-system/css'

const StyledCard = styled(
  'div',
  css({
    padding: 4,
    borderRadius: 'lg',
    boxShadow: 'md',
  }),
)
```

## Tokens and Semantic Tokens

### Using Design Tokens

```tsx
// Good: tokens
<Box padding={4} color="text" fontSize="body.md" />

// Bad: raw values
<Box padding="16px" color="#000" fontSize="14px" />
```

### Semantic Tokens

```tsx
// Good: semantic tokens
<Text color="text">Content</Text>
<Text color="text.disabled">Disabled content</Text>

// Bad: raw colors
<Text color="black">Content</Text>
<Text color="gray.500">Disabled content</Text>
```

### Discovering Available Tokens

Use `mcp_panda_get_semantic_tokens` for available tokens and values.

## Best Practices

### 1. Check Available Resources First

Before writing styles, check:

- Recipes and variants
- Patterns and props
- Tokens and semantic tokens
- Conditions

### 2. Use Responsive Values

```tsx
<Box padding={{ base: 2, md: 4, lg: 6 }} fontSize={{ base: 'body.sm', md: 'body.md' }} />
```

### 3. Use Conditions for Interactive States

```tsx
<Box
  backgroundColor="gray.100"
  _hover={{ backgroundColor: 'gray.200' }}
  _focus={{ ring: '2px solid', ringColor: 'blue.500' }}
  _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
/>
```

### 4. Prefer Composition Over Duplication

```tsx
import { linkRecipe } from '~/theme/recipes/link'
import { textRecipe } from '~/theme/recipes/text'
import deepmerge from 'deepmerge'

export const linkRecipe = deepmerge(
  textRecipe,
  defineRecipe({
    // Additional link-specific styles
  }),
)
```

### 5. Use Text Styles for Typography

```tsx
<Box textStyle="body.lg">Content</Box>
<Box textStyle="heading.h1">Title</Box>
```

### 6. Use Animation Tokens

```tsx
<Box animation="fade-in" animationDuration="normal" animationTimingFunction="emphasized-in" />
```

### 7. Type Safety

```tsx
import type { ComponentProps } from '~/styled-system/types'
import type { ButtonVariantProps } from '~/styled-system/recipes'

type ButtonProps = ComponentProps<typeof Button>

type Props = ButtonVariantProps & { customProp?: string }
```

## Using MCP Tools

- `mcp_panda_get_recipes` to check recipes and variants
- `mcp_panda_get_patterns` to check patterns and props
- `mcp_panda_get_semantic_tokens` to check tokens
- `mcp_panda_get_conditions` to check conditions

## Example Workflow

1. Need to style a component: check recipes, use one if available
2. Need layout: check patterns and use appropriate one
3. Need colors or tokens: check semantic tokens
4. Need responsive or state styling: check conditions

## Recipe Creation Workflow

1. Create or update recipe in `src/theme/recipes/[name].ts`
2. Export in `src/theme/recipes/index.ts` (in `recipes` or `slotRecipes`)
3. Run `pnpm --filter="frontend" run gen:panda`
4. Import from `~/styled-system/recipes`

## Example: Complete Component

```tsx
import type { FC } from 'react'
import { VStack, HStack, Box } from '~/styled-system/jsx'

export const Card: FC<{ title: string; description: string }> = ({ title, description }) => {
  return (
    <Box padding={4} borderRadius="lg" backgroundColor="white" boxShadow="md" _hover={{ boxShadow: 'lg' }}>
      <VStack gap={2} align="stretch">
        <Box fontSize="heading.desktop.md" fontWeight="bold">
          {title}
        </Box>
        <Box fontSize="body.md" color="text.disabled">
          {description}
        </Box>
        <HStack gap={2} justify="flex-end" mt={4}>
          <Box as="button" padding={2} borderRadius="lg">
            Cancel
          </Box>
          <Box as="button" padding={2} borderRadius="lg">
            Save
          </Box>
        </HStack>
      </VStack>
    </Box>
  )
}
```

## Example: New Recipe-Based Component

```tsx
// 1. Define the recipe (src/theme/recipes/card.ts)
import { defineRecipe } from '@pandacss/dev'

export const cardRecipe = defineRecipe({
  className: 'card',
  jsx: ['Card'],
  base: {
    padding: 4,
    borderRadius: 'lg',
    backgroundColor: 'white',
    boxShadow: 'md',
  },
  variants: {
    size: {
      sm: { padding: 2 },
      md: { padding: 4 },
      lg: { padding: 6 },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

// 2. Export it (src/theme/recipes/index.ts)
import { cardRecipe } from '~/theme/recipes/card'
export const recipes = {
  // ... existing
  card: cardRecipe,
}

// 3. Create the component (src/ui/card/styled.ts)
import { styled } from '~/styled-system/jsx'
import { card } from '~/styled-system/recipes'
import type { ComponentProps } from '~/styled-system/types'

export type CardProps = ComponentProps<typeof Card>
export const Card = styled('div', card)

// 4. Use it
<Card size="lg">Content</Card>
```

## Summary

- Always use Panda CSS for all styling
- Prioritize config recipes when available
- Use patterns for layout
- Use semantic tokens for theme-aware values
- Check MCP tools before writing styles
- Use TypeScript types from Panda
- Never use inline styles or other CSS solutions
- Never use raw values when tokens exist
- Never duplicate styles; create recipes instead

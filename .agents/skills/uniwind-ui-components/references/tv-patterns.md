# Tailwind-Variants Patterns for Uniwind Components

Sources:
- https://www.tailwind-variants.org/docs/getting-started
- https://www.tailwind-variants.org/docs/api-reference
- https://www.tailwind-variants.org/docs/slots
- https://www.tailwind-variants.org/docs/typescript
- https://www.tailwind-variants.org/docs/composing-components

## Standard Imports

```ts
import { cn, tv } from 'tailwind-variants'
import type { VariantProps } from 'tailwind-variants'
```

## Single-Part Component Pattern

```tsx
const buttonStyles = tv({
  base: 'min-h-12 items-center justify-center rounded-button px-4',
  variants: {
    variant: {
      primary: 'bg-primary border-primary',
      secondary: 'bg-secondary border-secondary',
    },
    size: {
      sm: 'min-h-10 px-3',
      md: 'min-h-12 px-4',
    },
    disabled: {
      true: 'opacity-60',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

type ButtonVariants = VariantProps<typeof buttonStyles>
```

## Slot-Based Compound Component Pattern

Use slots for multipart components (`Card.Root`, `Card.Header`, `Card.Body`, `Card.Footer`).

```tsx
import type { ComponentProps } from 'react'
import type { VariantProps } from 'tailwind-variants'

import { createContext, useContext } from 'react'
import { View } from 'react-native'
import { cn, tv } from 'tailwind-variants'

const cardStyles = tv({
  slots: {
    root: 'border rounded-card bg-card',
    header: 'px-4 pt-4',
    body: 'px-4 py-3',
    footer: 'px-4 pb-4 pt-2',
  },
  variants: {
    tone: {
      panel: { root: 'surface-panel' },
      hero: { root: 'surface-hero shadow-button' },
      item: { root: 'surface-item' },
    },
    density: {
      compact: {},
      comfy: {},
    },
  },
  compoundVariants: [
    {
      tone: 'hero',
      density: 'compact',
      class: { header: 'pb-1' },
    },
  ],
  compoundSlots: [
    {
      slots: ['header', 'body', 'footer'],
      density: 'compact',
      class: 'gap-1',
    },
    {
      slots: ['header', 'body', 'footer'],
      density: 'comfy',
      class: 'gap-2',
    },
  ],
  defaultVariants: {
    tone: 'panel',
    density: 'comfy',
  },
})

type CardVariants = VariantProps<typeof cardStyles>
type CardRootProps = ComponentProps<typeof View> & CardVariants
type CardSlotProps = ComponentProps<typeof View>

const CardVariantContext = createContext<CardVariants>({
  tone: 'panel',
  density: 'comfy',
})

function CardRoot({ tone = 'panel', density = 'comfy', className, ...props }: CardRootProps) {
  const { root } = cardStyles({ tone, density })
  return (
    <CardVariantContext.Provider value={{ tone, density }}>
      <View className={cn(root(), className)} {...props} />
    </CardVariantContext.Provider>
  )
}

function CardHeader({ className, ...props }: CardSlotProps) {
  const { tone, density } = useContext(CardVariantContext)
  const { header } = cardStyles({ tone, density })
  return <View className={cn(header(), className)} {...props} />
}

function CardBody({ className, ...props }: CardSlotProps) {
  const { tone, density } = useContext(CardVariantContext)
  const { body } = cardStyles({ tone, density })
  return <View className={cn(body(), className)} {...props} />
}

function CardFooter({ className, ...props }: CardSlotProps) {
  const { tone, density } = useContext(CardVariantContext)
  const { footer } = cardStyles({ tone, density })
  return <View className={cn(footer(), className)} {...props} />
}

export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
}
```

## Composition Tips

- Use `extend` to build themed/specialized variants without duplicating base contracts.
- Keep variant names semantic (`tone`, `size`, `density`, `intent`) rather than visual implementation names.
- Prefer `compoundVariants` for true intersections; avoid stacking one-off conditionals in render functions.
- Use `cn` from `tailwind-variants` directly for slot overrides and consumer `className` merges.

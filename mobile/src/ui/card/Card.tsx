import type { VariantProps } from 'tailwind-variants'

import { View, ViewProps } from 'react-native'
import { cn, tv } from 'tailwind-variants'

const cardVariants = tv({
  base: 'border bg-card',
  variants: {
    variant: {
      hero: 'surface-hero',
      panel: 'surface-panel',
      item: 'surface-item',
    },
    spacing: {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-5',
    },
  },
  defaultVariants: {
    variant: 'panel',
    spacing: 'md',
  },
})

type CardProps = ViewProps & VariantProps<typeof cardVariants>

export function Card({ className, variant, spacing, style, ...props }: CardProps) {
  return (
    <View
      className={cn(cardVariants({ variant, spacing }), className)}
      style={[
        {
          borderCurve: 'continuous',
        },
        style,
      ]}
      {...props}
    />
  )
}

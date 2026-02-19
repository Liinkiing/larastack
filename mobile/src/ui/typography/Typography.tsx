import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cva } from 'class-variance-authority'
import { Text } from 'react-native'

import { cn } from '~/utils/cn'

const typographyVariants = cva('', {
  variants: {
    variant: {
      display: 'text-display font-bold tracking-[-0.01em]',
      title: 'text-title font-bold',
      heading: 'text-heading font-semibold',
      body: 'text-body',
      caption: 'text-caption font-semibold tracking-[0.02em]',
      button: 'text-button font-bold tracking-[0.01em]',
      metric: 'text-metric font-bold',
    },
    tone: {
      default: 'text-foreground',
      muted: 'text-muted',
      subtle: 'text-muted-foreground',
      primary: 'text-primary',
    },
  },
  defaultVariants: {
    variant: 'body',
    tone: 'default',
  },
})

type TypographyProps = ComponentProps<typeof Text> & VariantProps<typeof typographyVariants>

export function Typography({ className, variant, tone, ...props }: TypographyProps) {
  return <Text className={cn(typographyVariants({ variant, tone }), className)} {...props} />
}

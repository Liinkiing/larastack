import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { createElement } from 'react'

import { cn, tv, type VariantProps } from '~/tailwind-variants'

export const textStyles = tv({
  base: 'max-w-full font-body text-wrap wrap-break-word text-current',
  variants: {
    bold: {
      true: 'font-bold',
    },
    italic: {
      true: 'italic',
    },
    medium: {
      true: 'font-medium',
    },
    normal: {
      true: 'font-normal',
    },
    semibold: {
      true: 'font-semibold',
    },
    size: {
      lg: 'text-body-lg',
      md: 'text-body-md',
      sm: 'text-body-sm',
    },
    tone: {
      default: 'text-current',
      disabled: 'text-text-disabled',
      muted: 'text-text-muted',
    },
    underline: {
      true: 'underline',
    },
    uppercase: {
      true: 'uppercase',
    },
  },
  defaultVariants: {
    size: 'md',
    tone: 'default',
  },
})

type Props<T extends ElementType> = {
  as?: T
  className?: string
} & VariantProps<typeof textStyles> &
  Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'color'>

export type TextProps<T extends ElementType = 'p'> = Props<T>

export function Text<T extends ElementType = 'p'>({
  as,
  className,
  bold,
  italic,
  medium,
  normal,
  semibold,
  size,
  tone,
  underline,
  uppercase,
  ...props
}: TextProps<T>) {
  const element = as ?? 'p'

  return createElement(element, {
    ...props,
    className: cn(textStyles({ bold, italic, medium, normal, semibold, size, tone, underline, uppercase }), className),
  })
}

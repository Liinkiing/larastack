import { ark } from '@ark-ui/react/factory'
import type { ComponentProps } from 'react'
import { createElement } from 'react'

import { cn, tv, type VariantProps } from '~/tailwind-variants'

export const buttonStyles = tv({
  base: [
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-body leading-none font-semibold',
    'transition-[transform,box-shadow,background,color,border-color] duration-200 ease-standard',
    'focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:outline-none',
    'disabled:pointer-events-none disabled:opacity-50',
    'hover:-translate-y-px active:translate-y-0',
  ],
  variants: {
    variant: {
      solid: 'bg-accent text-canvas hover:bg-accent-warm',
      soft: 'bg-accent-soft text-text hover:bg-surface-muted',
      outline: 'border border-border-subtle bg-transparent text-text hover:border-accent',
      ghost: 'bg-transparent text-text hover:bg-surface-muted',
    },
    size: {
      sm: 'px-3 py-2 text-body-sm',
      md: 'px-4 py-3 text-body-md',
      lg: 'px-5 py-4 text-body-lg',
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
})

export type ButtonProps = ComponentProps<typeof ark.button> & VariantProps<typeof buttonStyles>

export function Button({ className, size, variant, ...props }: ButtonProps) {
  return createElement(ark.button, {
    ...props,
    className: cn(buttonStyles({ size, variant }), className),
  })
}

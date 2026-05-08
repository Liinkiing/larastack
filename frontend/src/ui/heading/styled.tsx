import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { createElement } from 'react'

import { cn, tv, type VariantProps } from '~/tailwind-variants'

export const headingStyles = tv({
  base: 'max-w-full font-display text-wrap break-words text-current',
  variants: {
    italic: {
      true: 'italic',
    },
    underline: {
      true: 'underline',
    },
    size: {
      h1: 'text-heading-mobile-2xl leading-[1.05] font-semibold tracking-[-0.03em] sm:text-heading-desktop-2xl',
      h2: 'text-heading-mobile-lg leading-[1.1] font-semibold tracking-[-0.025em] sm:text-heading-desktop-lg',
      h3: 'text-heading-mobile-md leading-[1.15] font-semibold tracking-[-0.02em] sm:text-heading-desktop-md',
      h4: 'text-heading-mobile-sm leading-[1.25] font-semibold tracking-[-0.01em] sm:text-heading-desktop-sm',
      h5: 'text-heading-mobile-xs leading-[1.3] font-semibold sm:text-heading-desktop-xs',
      h6: 'text-heading-mobile-xs leading-[1.3] font-semibold sm:text-heading-desktop-xs',
    },
  },
  defaultVariants: {
    size: 'h2',
  },
})

type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export type HeadingProps = Omit<ComponentPropsWithoutRef<HeadingElement>, 'color'> &
  VariantProps<typeof headingStyles> & {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  }

export function Heading({ as = 'h2', className, size, ...props }: HeadingProps) {
  const element: ElementType = as

  return createElement(element, {
    ...props,
    className: cn(headingStyles({ size: size ?? as }), className),
  })
}

Heading.displayName = 'Heading'

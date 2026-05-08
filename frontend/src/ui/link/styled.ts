import { ark } from '@ark-ui/react/factory'
import type { ComponentProps } from 'react'
import { createElement } from 'react'

import { cn, tv, type VariantProps } from '~/tailwind-variants'

export const linkStyles = tv({
  base: [
    'font-body font-semibold text-text no-underline decoration-2 underline-offset-4',
    'transition-[color,text-decoration-color,background] duration-200 ease-standard',
    'focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:outline-none',
    'hover:text-accent hover:underline hover:decoration-accent/40',
    'aria-disabled:pointer-events-none aria-disabled:text-text-disabled data-disabled:pointer-events-none data-disabled:text-text-disabled',
  ],
})

export type LinkProps = ComponentProps<typeof ark.a> & VariantProps<typeof linkStyles>

export function Link({ className, ...props }: LinkProps) {
  return createElement(ark.a, {
    ...props,
    className: cn(linkStyles(), className),
  })
}

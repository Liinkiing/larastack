import type { AnchorHTMLAttributes } from 'react'

import { tv } from '~/tailwind-variants'
import type { VariantProps } from '~/tailwind-variants'

export const linkVariants = tv({
  base: [
    'font-body font-semibold text-foreground no-underline decoration-primary/40 decoration-2 underline-offset-4',
    'transition-colors duration-200 ease-out hover:text-primary hover:underline',
    'focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none',
    'aria-disabled:pointer-events-none aria-disabled:opacity-50',
  ],
  variants: {
    size: {
      sm: 'text-sm leading-[1.6]',
      md: 'text-base leading-[1.65]',
      lg: 'text-lg leading-[1.7]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps<typeof linkVariants>

export function Link({ className, size, ...props }: LinkProps) {
  return <a data-slot="link" className={linkVariants({ className, size })} {...props} />
}

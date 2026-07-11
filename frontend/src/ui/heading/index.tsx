import type { HTMLAttributes } from 'react'

import { tv } from '~/tailwind-variants'
import type { VariantProps } from '~/tailwind-variants'

export const headingVariants = tv({
  base: 'font-display text-current',
  variants: {
    italic: { true: 'italic' },
    underline: { true: 'underline' },
    size: {
      h1: 'text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.03em] sm:text-[3.5rem]',
      h2: 'text-[2rem] leading-[1.1] font-semibold tracking-[-0.025em] sm:text-[2.625rem]',
      h3: 'text-[1.625rem] leading-[1.15] font-semibold tracking-[-0.02em] sm:text-[2.125rem]',
      h4: 'text-[1.375rem] leading-[1.25] font-semibold tracking-[-0.01em] sm:text-[1.625rem]',
      h5: 'text-xl leading-[1.3] font-semibold sm:text-[1.375rem]',
      h6: 'text-xl leading-[1.3] font-semibold sm:text-[1.375rem]',
    },
  },
  defaultVariants: {
    size: 'h2',
  },
})

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof headingVariants> & {
    as?: HeadingTag
  }

export function Heading({ as: Component = 'h2', className, size, ...props }: HeadingProps) {
  return (
    <Component data-slot="heading" className={headingVariants({ className, size: size ?? Component })} {...props} />
  )
}

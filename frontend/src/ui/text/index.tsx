import type { ComponentPropsWithoutRef, ElementType } from 'react'

import { tv } from '~/tailwind-variants'
import type { VariantProps } from '~/tailwind-variants'

export const textVariants = tv({
  base: 'font-body text-current',
  variants: {
    bold: { true: 'font-bold' },
    italic: { true: 'italic' },
    medium: { true: 'font-medium' },
    normal: { true: 'font-normal' },
    semibold: { true: 'font-semibold' },
    underline: { true: 'underline' },
    uppercase: { true: 'uppercase' },
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

type TextOwnProps = VariantProps<typeof textVariants> & {
  as?: ElementType
  className?: string
}

export type TextProps<T extends ElementType = 'p'> = TextOwnProps &
  Omit<ComponentPropsWithoutRef<T>, keyof TextOwnProps>

export function Text<T extends ElementType = 'p'>({ as: Component = 'p', className, size, ...props }: TextProps<T>) {
  return <Component data-slot="text" className={textVariants({ className, size })} {...props} />
}

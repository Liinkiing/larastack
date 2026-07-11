import { Button as ButtonPrimitive } from '@base-ui/react/button'

import { tv } from '~/tailwind-variants'
import type { VariantProps } from '~/tailwind-variants'

export const buttonVariants = tv({
  base: [
    'group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-transparent bg-clip-padding font-body leading-none font-semibold whitespace-nowrap outline-none select-none',
    'transition-[transform,box-shadow,background-color,color,border-color] duration-200 ease-out',
    'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
    'disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
    'hover:-translate-y-px active:translate-y-0',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  variants: {
    variant: {
      solid: 'bg-primary text-primary-foreground hover:bg-primary-warm',
      default: 'bg-primary text-primary-foreground hover:bg-primary-warm',
      soft: 'bg-primary-soft text-foreground hover:bg-secondary',
      secondary: 'bg-primary-soft text-foreground hover:bg-secondary',
      outline: 'border border-border bg-transparent text-foreground hover:border-primary hover:bg-card/60',
      ghost: 'bg-transparent text-foreground hover:bg-secondary',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      link: 'rounded-none p-0 text-primary underline-offset-4 hover:translate-y-0 hover:underline',
    },
    size: {
      sm: 'min-h-9 px-3 py-2 text-sm',
      md: 'min-h-11 px-4 py-3 text-base',
      default: 'min-h-11 px-4 py-3 text-base',
      lg: 'min-h-13 px-5 py-4 text-lg',
      icon: 'size-11 p-0',
      'icon-sm': 'size-9 p-0 [&_svg:not([class*="size-"])]:size-3.5',
      'icon-lg': 'size-13 p-0 [&_svg:not([class*="size-"])]:size-5',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'solid',
  },
})

export type ButtonProps = Omit<ButtonPrimitive.Props, 'className'> &
  VariantProps<typeof buttonVariants> & {
    className?: string
  }

export function Button({ className, size, variant, ...props }: ButtonProps) {
  return <ButtonPrimitive data-slot="button" className={buttonVariants({ className, size, variant })} {...props} />
}

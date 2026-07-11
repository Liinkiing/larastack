import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '~/tailwind-variants'

export function PageLayout({ className, ...props }: ComponentPropsWithoutRef<'main'>) {
  return (
    <main
      className={cn('mx-auto min-h-[calc(100dvh-6rem)] w-full max-w-300 px-5 py-10 md:px-10 md:py-16', className)}
      {...props}
    />
  )
}

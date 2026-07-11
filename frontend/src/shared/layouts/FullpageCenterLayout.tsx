import type { HTMLAttributes } from 'react'

import { cn } from '~/tailwind-variants'

export function FullPageCenterLayout({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('fixed inset-0 flex flex-col items-stretch justify-center px-8 md:items-center', className)}
      {...props}
    />
  )
}

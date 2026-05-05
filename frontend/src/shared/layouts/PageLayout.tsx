import type { ComponentProps, FC } from 'react'

import { cn } from '~/tailwind-variants'

type Props = ComponentProps<'main'>

export const PageLayout: FC<Props> = ({ className, ...props }) => {
  return (
    <main
      className={cn('mx-auto min-h-[calc(100dvh-96px)] w-full max-w-[1200px] px-5 py-10 md:px-10 md:py-16', className)}
      {...props}
    />
  )
}

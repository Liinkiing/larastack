import type { ComponentProps, FC } from 'react'

import { cn } from '~/tailwind-variants'

type Props = ComponentProps<'main'>

export const FullPageCenterLayout: FC<Props> = ({ className, ...props }) => {
  return (
    <main
      className={cn('fixed inset-0 flex flex-col items-stretch justify-center px-8 md:items-center', className)}
      {...props}
    />
  )
}

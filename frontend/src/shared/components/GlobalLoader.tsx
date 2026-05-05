import Image from 'next/image'
import type { ComponentProps, FC } from 'react'

import { FullPageCenterLayout } from '~/shared/layouts/FullpageCenterLayout'

type Props = ComponentProps<typeof FullPageCenterLayout>

export const GlobalLoader: FC<Props> = props => {
  return (
    <FullPageCenterLayout className="items-center" {...props}>
      <Image priority alt="loading" height={38} src="/assets/tail-spin.svg" width={38} />
    </FullPageCenterLayout>
  )
}

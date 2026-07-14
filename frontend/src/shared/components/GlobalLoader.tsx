import Image from 'next/image'
import type { FC } from 'react'

import { FullPageCenterLayout } from '~/shared/layouts/FullpageCenterLayout'
import type { CenterProps } from '~/styled-system/jsx'

export const GlobalLoader: FC<CenterProps> = props => {
  return (
    <FullPageCenterLayout alignItems="center" aria-label="Loading" aria-live="polite" role="status" {...props}>
      <Image priority alt="" height={38} src="/assets/tail-spin.svg" width={38} />
    </FullPageCenterLayout>
  )
}

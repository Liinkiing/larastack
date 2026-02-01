import type { FC } from 'react'

import Image from 'next/image'

import type { CenterProps } from '~/styled-system/jsx'

import { FullPageCenterLayout } from '~/shared/layouts/FullpageCenterLayout'

export const GlobalLoader: FC<CenterProps> = props => {
  return (
    <FullPageCenterLayout alignItems="center" {...props}>
      <Image priority alt="loading" height={38} src="/assets/tail-spin.svg" width={38} />
    </FullPageCenterLayout>
  )
}

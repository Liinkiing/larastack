import Image from 'next/image'
import type { ComponentPropsWithoutRef } from 'react'

import { FullPageCenterLayout } from '~/shared/layouts/FullpageCenterLayout'

export function GlobalLoader(props: ComponentPropsWithoutRef<typeof FullPageCenterLayout>) {
  return (
    <FullPageCenterLayout className="items-center" {...props}>
      <Image priority alt="loading" height={38} src="/assets/tail-spin.svg" width={38} />
    </FullPageCenterLayout>
  )
}

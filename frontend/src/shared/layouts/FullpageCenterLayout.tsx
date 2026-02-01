import type { FC } from 'react'

import type { CenterProps } from '~/styled-system/jsx'

import { Center } from '~/styled-system/jsx'

export const FullPageCenterLayout: FC<CenterProps> = props => {
  return (
    <Center
      alignItems={{
        base: 'stretch',
        md: 'center',
      }}
      flexDirection="column"
      inset={0}
      position="fixed"
      px={8}
      {...props}
    />
  )
}

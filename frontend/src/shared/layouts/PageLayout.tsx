import type { FC } from 'react'

import type { BoxProps } from '~/styled-system/jsx'

import { Box } from '~/styled-system/jsx'

export const PageLayout: FC<BoxProps> = props => {
  return (
    <Box
      as="main"
      maxW="1200px"
      minH="calc(100dvh - 96px)"
      mx="auto"
      px={{ base: 5, md: 10 }}
      py={{ base: 10, md: 16 }}
      w="full"
      {...props}
    />
  )
}

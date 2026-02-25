import type { FC } from 'react'

import { FullPageCenterLayout } from '~/shared/layouts/FullpageCenterLayout'
import type { CenterProps } from '~/styled-system/jsx'
import { VStack } from '~/styled-system/jsx'
import { Button } from '~/ui/button'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

type Props = CenterProps & {
  message?: string
}

export const GenericErrorLayout: FC<Props> = ({ message, ...props }) => {
  return (
    <FullPageCenterLayout {...props}>
      <VStack gap={4} maxW="480px" textAlign="center">
        <Heading as="h1">Something went wrong</Heading>
        {message ? (
          <Text as="pre" backgroundColor="bg.surface.muted" borderRadius="xl" px={4} py={3} textAlign="left">
            {message}
          </Text>
        ) : null}
        <Button size="lg" onClick={() => globalThis.location.reload()}>
          Reload page
        </Button>
      </VStack>
    </FullPageCenterLayout>
  )
}

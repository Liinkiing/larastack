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
      <VStack>
        <Heading as="h1">Une erreur est survenue</Heading>
        {message ? (
          <code>
            <Text as="pre">{message}</Text>
          </code>
        ) : null}
        <Button onClick={() => globalThis.location.reload()}>Recharger</Button>
      </VStack>
    </FullPageCenterLayout>
  )
}

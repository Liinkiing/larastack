'use client'

import type { ErrorComponent } from 'next/dist/client/components/error-boundary'

import { FullPageCenterLayout } from '~/shared/layouts/FullpageCenterLayout'
import { VStack } from '~/styled-system/jsx'
import { Button } from '~/ui/button'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

const GlobalError: ErrorComponent = ({ reset }) => (
  <html lang="en">
    <body>
      <FullPageCenterLayout>
        <VStack gap={4} maxW="480px" textAlign="center">
          <Heading as="h2">Something went sideways</Heading>
          <Text color="text.muted">
            We hit a snag while loading this page. Give it another go, or refresh to reset the view.
          </Text>
          <Button
            size="lg"
            onClick={() => {
              if (reset) {
                reset()
              } else {
                globalThis.location.reload()
              }
            }}
          >
            Try again
          </Button>
        </VStack>
      </FullPageCenterLayout>
    </body>
  </html>
)
export default GlobalError

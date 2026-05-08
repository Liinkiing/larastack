'use client'

import type { ErrorComponent } from 'next/dist/client/components/error-boundary'

import { FullPageCenterLayout } from '~/shared/layouts/FullpageCenterLayout'
import { Button } from '~/ui/button'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

const GlobalError: ErrorComponent = ({ reset }) => (
  <html lang="en">
    <body>
      <FullPageCenterLayout>
        <div className="flex max-w-[480px] flex-col items-center gap-4 text-center">
          <Heading as="h2">Something went sideways</Heading>
          <Text tone="muted">
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
        </div>
      </FullPageCenterLayout>
    </body>
  </html>
)
export default GlobalError

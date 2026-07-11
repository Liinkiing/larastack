import type { ComponentPropsWithoutRef } from 'react'

import { FullPageCenterLayout } from '~/shared/layouts/FullpageCenterLayout'
import { Button } from '~/ui/button'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

type Props = ComponentPropsWithoutRef<typeof FullPageCenterLayout> & {
  message?: string
}

export function GenericErrorLayout({ message, ...props }: Props) {
  return (
    <FullPageCenterLayout {...props}>
      <div className="flex max-w-120 flex-col gap-4 text-center">
        <Heading as="h1">Something went wrong</Heading>
        {message ? (
          <Text as="pre" className="overflow-auto rounded-xl bg-muted px-4 py-3 text-left">
            {message}
          </Text>
        ) : null}
        <Button size="lg" onClick={() => globalThis.location.reload()}>
          Reload page
        </Button>
      </div>
    </FullPageCenterLayout>
  )
}

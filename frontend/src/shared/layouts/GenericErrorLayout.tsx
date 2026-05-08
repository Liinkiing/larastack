import type { ComponentProps, FC } from 'react'

import { FullPageCenterLayout } from '~/shared/layouts/FullpageCenterLayout'
import { Button } from '~/ui/button'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

type Props = ComponentProps<typeof FullPageCenterLayout> & {
  message?: string
}

export const GenericErrorLayout: FC<Props> = ({ message, ...props }) => {
  return (
    <FullPageCenterLayout {...props}>
      <div className="flex max-w-[480px] flex-col items-center gap-4 text-center">
        <Heading as="h1">Something went wrong</Heading>
        {message ? (
          <Text as="pre" className="rounded-xl bg-surface-muted px-4 py-3 text-left">
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

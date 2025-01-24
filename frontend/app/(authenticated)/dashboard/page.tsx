'use client'

import { useAuth } from '~/shared/hooks/useAuth'
import { PageLayout } from '~/shared/layouts/PageLayout'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

export default function HomePage() {
  const { viewer } = useAuth()

  return (
    <PageLayout>
      <Heading as="h1">Home</Heading>
      <Text>
        Hi {viewer.name} ({viewer.email})
      </Text>
    </PageLayout>
  )
}

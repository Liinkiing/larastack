import type { Metadata } from 'next'

import { PageLayout } from '~/shared/layouts/PageLayout'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

export const metadata: Metadata = {
  description: 'The privacy policy description',
  title: 'Privacy policy',
}

export default function PrivacyPolicyPage() {
  return (
    <PageLayout>
      <Heading as="h1">Privacy policy</Heading>
      <Text>Your privacy policy</Text>
    </PageLayout>
  )
}

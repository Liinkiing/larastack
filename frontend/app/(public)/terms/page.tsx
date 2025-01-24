import type { Metadata } from 'next'

import { PageLayout } from '~/shared/layouts/PageLayout'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

export const metadata: Metadata = {
  description: 'Terms and conditions',
  title: 'Terms',
}

export default function TermsPage() {
  return (
    <PageLayout>
      <Heading as="h1">Terms</Heading>
      <Text>Your terms</Text>
    </PageLayout>
  )
}

import type { Metadata } from 'next'

import { PageLayout } from '~/shared/layouts/PageLayout'
import { Stack } from '~/styled-system/jsx'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

export const metadata: Metadata = {
  description: 'Terms and conditions',
  title: 'Terms',
}

export default function TermsPage() {
  return (
    <PageLayout>
      <Stack gap={6} maxW="720px">
        <Heading as="h1">Terms</Heading>
        <Text color="text.muted">
          By using Larastack you agree to keep credentials safe, respect rate limits, and avoid misuse of the platform.
          We keep the service friendly, fast, and reliable for everyone.
        </Text>
        <Stack gap={4}>
          <Heading as="h3">Acceptable use</Heading>
          <Text color="text.muted">
            Do not attempt to break, overload, or reverse engineer the service. Keep content professional and comply
            with applicable regulations.
          </Text>
        </Stack>
        <Stack gap={4}>
          <Heading as="h3">Service updates</Heading>
          <Text color="text.muted">
            We may refine or update features, and we will do our best to announce major changes ahead of time.
          </Text>
        </Stack>
      </Stack>
    </PageLayout>
  )
}

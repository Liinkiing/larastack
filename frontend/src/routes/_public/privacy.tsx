import { createFileRoute } from '@tanstack/react-router'

import { PageLayout } from '~/shared/layouts/PageLayout'
import { Stack } from '~/styled-system/jsx'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

export const Route = createFileRoute('/_public/privacy')({
  component: PrivacyPolicyPage,
})

function PrivacyPolicyPage() {
  return (
    <PageLayout>
      <Stack gap={6} maxW="720px">
        <Heading as="h1">Privacy policy</Heading>
        <Text color="text.muted">
          We collect only what we need to keep your workspace secure and responsive. This includes your account
          identity, session status, and essential usage data for service reliability.
        </Text>
        <Stack gap={4}>
          <Heading as="h3">What we store</Heading>
          <Text color="text.muted">
            Authentication tokens, profile information, and settings you explicitly provide. We do not sell personal
            data or share it with advertisers.
          </Text>
        </Stack>
        <Stack gap={4}>
          <Heading as="h3">How we protect it</Heading>
          <Text color="text.muted">
            Encrypted storage, secure transport, and regular review of access controls. You can request deletion or a
            copy of your data at any time.
          </Text>
        </Stack>
      </Stack>
    </PageLayout>
  )
}

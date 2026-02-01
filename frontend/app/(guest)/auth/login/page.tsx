'use client'

import { AppLink } from '~/shared/components/AppLink'
import { useAuth } from '~/shared/hooks/useAuth'
import { PageLayout } from '~/shared/layouts/PageLayout'
import { Box, HStack, Stack } from '~/styled-system/jsx'
import { Button } from '~/ui/button'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

export default function LoginPage() {
  const { loginWithProvider } = useAuth()

  return (
    <PageLayout>
      <Box maxW="520px" mx="auto">
        <Stack
          animation="fade-in"
          backgroundColor="bg.surface"
          border="1px solid"
          borderColor="border.subtle"
          borderRadius="28px"
          gap={5}
          p={{ base: 6, md: 8 }}
        >
          <Stack gap={2}>
            <Heading as="h1">Welcome back</Heading>
            <Text color="text.muted">
              Step into your workspace with a quick sign-in. We will keep it light, quick, and secure.
            </Text>
          </Stack>
          <Button size="lg" onClick={() => loginWithProvider('google')}>
            Continue with Google
          </Button>
          <HStack justify="space-between">
            <Text color="text.muted" fontSize="body.sm">
              By continuing, you agree to our terms.
            </Text>
            <Button asChild size="sm" variant="ghost">
              <AppLink href="/terms">See terms</AppLink>
            </Button>
          </HStack>
        </Stack>
      </Box>
    </PageLayout>
  )
}

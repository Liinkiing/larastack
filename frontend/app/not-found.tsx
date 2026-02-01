import { AppLink } from '~/shared/components/AppLink'
import { PageLayout } from '~/shared/layouts/PageLayout'
import { Box, HStack, Stack, VStack } from '~/styled-system/jsx'
import { Button } from '~/ui/button'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

export default function NotFound() {
  return (
    <PageLayout>
      <Stack gap={{ base: 8, md: 12 }}>
        <VStack alignItems="flex-start" animation="fade-in" gap={4} maxW="520px">
          <HStack
            alignItems="center"
            backgroundColor="bg.surface"
            border="1px solid"
            borderColor="border.subtle"
            borderRadius="999px"
            gap={3}
            px={4}
            py={2}
            width="fit-content"
          >
            <Box backgroundColor="accent.solid" borderRadius="999px" height="10px" width="10px" />
            <Text color="text.muted" fontSize="body.sm" fontWeight="600" letterSpacing="0.02em">
              404 — This page slipped off the grid
            </Text>
          </HStack>
          <Heading as="h1">Lost in the soft glow.</Heading>
          <Text color="text.muted" fontSize="body.lg">
            We couldn&apos;t find that page, but the rest of the stack is humming. Glide back home or sign in.
          </Text>
          <Stack direction={{ base: 'column', sm: 'row' }} gap={3} width={{ base: 'full', sm: 'auto' }}>
            <Button asChild size="lg">
              <AppLink href="/">Back home</AppLink>
            </Button>
          </Stack>
        </VStack>
      </Stack>
    </PageLayout>
  )
}

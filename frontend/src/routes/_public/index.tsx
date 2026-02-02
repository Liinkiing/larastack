import { createFileRoute } from '@tanstack/react-router'

import { AppLink } from '~/shared/components/AppLink'
import { AuthenticatedGuard } from '~/shared/guards/AuthenticatedGuard'
import { PageLayout } from '~/shared/layouts/PageLayout'
import { Box, Flex, Grid, HStack, Stack, VStack } from '~/styled-system/jsx'
import { Button } from '~/ui/button'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

export const Route = createFileRoute('/_public/')({
  component: Home,
})

function Home() {
  return (
    <PageLayout>
      <Stack gap={{ base: 10, md: 16 }}>
        <Grid gap={{ base: 8, md: 12 }} gridTemplateColumns={{ base: '1fr', lg: '1.1fr 0.9fr' }}>
          <Stack animation="fade-in" gap={{ base: 5, md: 6 }}>
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
                Playful, modern, and ready to ship
              </Text>
            </HStack>
            <Heading as="h1">Build bold experiences with a gentle, cherry-bright rhythm.</Heading>
            <Text color="text.muted" fontSize="body.lg" maxW="520px">
              Larastack pairs Laravel and Next.js in a lively, crafted shell that feels warm, human, and fast. It is
              colorful without shouting, and expressive without the noise.
            </Text>
            <Stack align={{ base: 'stretch', sm: 'center' }} direction={{ base: 'column', sm: 'row' }} gap={3}>
              <AuthenticatedGuard
                fallback={
                  <>
                    <Button asChild size="lg">
                      <AppLink href="/auth/login">Start a session</AppLink>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <AppLink href="/dashboard">View dashboard</AppLink>
                    </Button>
                  </>
                }
              >
                <Button asChild size="lg">
                  <AppLink href="/dashboard">View dashboard</AppLink>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <AppLink href="#">Close your session</AppLink>
                </Button>
              </AuthenticatedGuard>
            </Stack>
            <Stack direction={{ base: 'column', sm: 'row' }} flexWrap="wrap" gap={{ base: 3, sm: 6 }}>
              {['GraphQL-first', 'Zero-friction auth', 'Design tokens baked in'].map(label => (
                <HStack key={label} gap={2}>
                  <Box backgroundColor="accent.mint" borderRadius="999px" height="8px" width="8px" />
                  <Text color="text.muted" fontSize="body.sm">
                    {label}
                  </Text>
                </HStack>
              ))}
            </Stack>
          </Stack>
          <Stack animation="fade-in" gap={4} style={{ animationDelay: '120ms' }}>
            <Box
              backgroundColor="bg.surface"
              border="1px solid"
              borderColor="border.subtle"
              borderRadius="24px"
              p={{ base: 5, md: 6 }}
            >
              <Stack gap={5}>
                <HStack justify="space-between">
                  <Text fontWeight="700">Daily pulse</Text>
                  <Text color="text.muted" fontSize="body.sm">
                    2 min read
                  </Text>
                </HStack>
                <Heading as="h3">A softer dashboard for fast teams.</Heading>
                <Text color="text.muted">
                  Curate your next deploy, see the auth rhythm, and keep teams aligned in a view that feels alive.
                </Text>
                <Grid
                  gap={3}
                  gridTemplateColumns={{
                    base: '1fr',
                    sm: 'repeat(2, minmax(0, 1fr))',
                  }}
                >
                  {[
                    { label: 'Active sessions', value: '128' },
                    { label: 'Build time', value: '4m 12s' },
                    { label: 'Incidents', value: '0' },
                    { label: 'PRs merged', value: '34' },
                  ].map(item => (
                    <Stack key={item.label} backgroundColor="bg.surface.muted" borderRadius="20px" gap={1} p={4}>
                      <Text color="text.muted" fontSize="body.sm">
                        {item.label}
                      </Text>
                      <Text fontFamily="display" fontSize="body.lg" fontWeight="700">
                        {item.value}
                      </Text>
                    </Stack>
                  ))}
                </Grid>
              </Stack>
            </Box>
            <Grid
              gap={3}
              gridTemplateColumns={{
                base: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
              }}
            >
              {[
                {
                  body: 'Colocated fragments keep data tidy.',
                  title: 'GraphQL ready',
                },
                {
                  body: 'Panda CSS keeps the palette consistent.',
                  title: 'Token driven',
                },
                {
                  body: 'Sanctum plus social login out of the box.',
                  title: 'Auth flows',
                },
                {
                  body: 'Subtle animation cues everywhere.',
                  title: 'Motion polish',
                },
              ].map(card => (
                <Stack
                  key={card.title}
                  backgroundColor="bg.surface"
                  border="1px solid"
                  borderColor="border.subtle"
                  borderRadius="18px"
                  gap={2}
                  p={4}
                >
                  <Text fontFamily="display" fontSize="body.md" fontWeight="700">
                    {card.title}
                  </Text>
                  <Text color="text.muted" fontSize="body.sm">
                    {card.body}
                  </Text>
                </Stack>
              ))}
            </Grid>
          </Stack>
        </Grid>
        <Flex
          align={{ base: 'flex-start', md: 'center' }}
          animation="fade-in"
          backgroundColor="bg.surface"
          border="1px solid"
          borderColor="border.subtle"
          borderRadius="32px"
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: 6, md: 10 }}
          justify="space-between"
          p={{ base: 6, md: 10 }}
          style={{ animationDelay: '200ms' }}
          wrap="wrap"
        >
          <VStack alignItems="flex-start" gap={2} maxW={{ base: '100%', lg: '520px' }}>
            <Heading as="h2">Turn the skeleton into a studio.</Heading>
            <Text color="text.muted" fontSize="body.lg">
              Swap the placeholder screens for a bold product experience. This kit gives you the rhythm, you decide the
              melody.
            </Text>
          </VStack>
          <Stack direction={{ base: 'column', sm: 'row' }} gap={3} width={{ base: 'full', sm: 'auto' }}>
            <Button asChild size="lg" variant="soft">
              <AppLink href="/terms">Read the terms</AppLink>
            </Button>
            <Button asChild size="lg">
              <AppLink href="/auth/login">Join the flow</AppLink>
            </Button>
          </Stack>
        </Flex>
      </Stack>
    </PageLayout>
  )
}

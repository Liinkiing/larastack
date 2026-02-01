'use client'

import { useAuth } from '~/shared/hooks/useAuth'
import { PageLayout } from '~/shared/layouts/PageLayout'
import { Box, Grid, HStack, Stack } from '~/styled-system/jsx'
import { Button } from '~/ui/button'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

export default function HomePage() {
  const { viewer } = useAuth()

  return (
    <PageLayout>
      <Stack gap={{ base: 8, md: 12 }}>
        <Stack gap={3}>
          <Heading as="h1">Welcome back, {viewer.name}</Heading>
          <Text color="text.muted" fontSize="body.lg">
            Your workspace is humming. Here is a quick glance at what is moving today.
          </Text>
          <HStack flexWrap="wrap" gap={3}>
            <Button size="sm" variant="soft">
              New project
            </Button>
            <Button size="sm" variant="outline">
              Invite team
            </Button>
          </HStack>
        </Stack>
        <Grid gap={4} gridTemplateColumns={{ base: '1fr', md: 'repeat(3, minmax(0, 1fr))' }}>
          {[
            { detail: '4 are high priority', label: 'Open tasks', value: '18' },
            {
              detail: 'Last build 12 min ago',
              label: 'Deploy status',
              value: 'Green',
            },
            { detail: 'Up 8% this week', label: 'Sessions', value: '128' },
          ].map(card => (
            <Stack
              key={card.label}
              backgroundColor="bg.surface"
              border="1px solid"
              borderColor="border.subtle"
              borderRadius="24px"
              gap={2}
              p={5}
            >
              <Text color="text.muted" fontSize="body.sm">
                {card.label}
              </Text>
              <Text fontFamily="display" fontSize="heading.mobile.md" fontWeight="700">
                {card.value}
              </Text>
              <Text color="text.muted" fontSize="body.sm">
                {card.detail}
              </Text>
            </Stack>
          ))}
        </Grid>
        <Box
          backgroundColor="accent.soft"
          border="1px solid"
          borderColor="accent.solid"
          borderRadius="28px"
          p={{ base: 6, md: 8 }}
        >
          <Stack gap={4}>
            <Heading as="h3">Your focus for today</Heading>
            <Text color="text.muted">
              Tidy up the onboarding checklist, sync auth flow notes, and ship the next dashboard animation pass.
            </Text>
          </Stack>
        </Box>
      </Stack>
    </PageLayout>
  )
}

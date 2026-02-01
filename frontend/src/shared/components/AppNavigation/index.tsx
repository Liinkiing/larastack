import type { FC } from 'react'

import { routes } from '~app/routes'

import { AppLink } from '~/shared/components/AppLink'
import { LogoutButton } from '~/shared/components/LogoutButton'
import { AuthenticatedGuard } from '~/shared/guards/AuthenticatedGuard'
import { Box, Flex, HStack } from '~/styled-system/jsx'
import { Text } from '~/ui/text'

import { AppNavigationItem } from './components/AppNavigationItem'

export const AppNavigation: FC = () => {
  return (
    <Box position="sticky" pt={{ base: 4, md: 6 }} px={{ base: 4, md: 8 }} top={0} zIndex={10}>
      <Flex
        align="center"
        backdropBlur="16px"
        backdropFilter="auto"
        backgroundColor="bg.surface/80"
        border="1px solid"
        borderColor="border.subtle"
        borderRadius="full"
        gap={2}
        px={{ base: 4, md: 6 }}
        py={{ base: 3, md: 4 }}
      >
        <HStack gap={3}>
          <AppLink borderRadius="full" fontWeight="700" href={routes.root} letterSpacing="-0.02em" px={2} py={1}>
            <HStack gap={1}>
              <Text as="span" color="text.muted" fontFamily="display">
                Lara
              </Text>
              <Text as="span" color="accent.solid" fontFamily="display">
                stack
              </Text>
            </HStack>
          </AppLink>
          <AppNavigationItem href={routes.root}>Home</AppNavigationItem>
          <AppNavigationItem href={routes.terms.root}>Terms</AppNavigationItem>
          <AppNavigationItem href={routes.privacyPolicy.root}>Privacy</AppNavigationItem>
        </HStack>
        <HStack gap={2} ml="auto">
          <AuthenticatedGuard fallback={<AppNavigationItem href={routes.auth.login.root}>Login</AppNavigationItem>}>
            <AppNavigationItem href={routes.dashboard.root}>Dashboard</AppNavigationItem>
            <LogoutButton size="sm" variant="soft" />
          </AuthenticatedGuard>
        </HStack>
      </Flex>
    </Box>
  )
}

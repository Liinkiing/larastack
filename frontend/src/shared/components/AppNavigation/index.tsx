import type { FC } from 'react'

import { LogoutButton } from '~/shared/components/LogoutButton'
import { AuthenticatedGuard } from '~/shared/guards/AuthenticatedGuard'
import { HStack } from '~/styled-system/jsx'
import { routes } from '~app/routes'

import { AppNavigationItem } from './components/AppNavigationItem'

export const AppNavigation: FC = () => {
  return (
    <HStack px={4} py={2}>
      <AppNavigationItem href={routes.root}>Home</AppNavigationItem>
      <AppNavigationItem href={routes.terms.root}>Terms</AppNavigationItem>
      <AppNavigationItem href={routes.privacyPolicy.root}>Privacy</AppNavigationItem>
      <HStack gap={2} ml="auto">
        <AuthenticatedGuard fallback={<AppNavigationItem href={routes.auth.login.root}>Login</AppNavigationItem>}>
          <AppNavigationItem href={routes.dashboard.root}>Dashboard</AppNavigationItem>
          <LogoutButton />
        </AuthenticatedGuard>
      </HStack>
    </HStack>
  )
}

import type { FC } from 'react'
import { routes } from '~app/routes'

import { AppLink } from '~/shared/components/AppLink'
import { LogoutButton } from '~/shared/components/LogoutButton'
import { AuthenticatedGuard } from '~/shared/guards/AuthenticatedGuard'
import { Text } from '~/ui/text'

import { AppNavigationItem } from './components/AppNavigationItem'

export const AppNavigation: FC = () => {
  return (
    <header className="sticky top-0 z-10 w-full max-w-full min-w-0 px-4 pt-4 md:px-8 md:pt-6">
      <nav className="flex w-full max-w-full min-w-0 items-center gap-2 overflow-x-auto rounded-full border border-border-subtle bg-surface/80 px-4 py-3 backdrop-blur-md [scrollbar-width:none] md:px-6 md:py-4 [&::-webkit-scrollbar]:hidden">
        <div className="flex shrink-0 items-center gap-3">
          <AppLink className="rounded-full px-2 py-1 font-bold tracking-[-0.02em]" href={routes.root}>
            <span className="flex items-center gap-1">
              <Text as="span" className="font-display" tone="muted">
                Lara
              </Text>
              <Text as="span" className="font-display text-accent">
                stack
              </Text>
            </span>
          </AppLink>
          <AppNavigationItem href={routes.root}>Home</AppNavigationItem>
          <AppNavigationItem href={routes.terms.root}>Terms</AppNavigationItem>
          <AppNavigationItem href={routes.privacyPolicy.root}>Privacy</AppNavigationItem>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <AuthenticatedGuard fallback={<AppNavigationItem href={routes.auth.login.root}>Login</AppNavigationItem>}>
            <AppNavigationItem href={routes.dashboard.root}>Dashboard</AppNavigationItem>
            <LogoutButton size="sm" variant="soft" />
          </AuthenticatedGuard>
        </div>
      </nav>
    </header>
  )
}

import type { FC } from 'react'
import { routes } from '~app/routes'

import { AppLink } from '~/shared/components/AppLink'
import { LogoutButton } from '~/shared/components/LogoutButton'
import { AuthenticatedGuard } from '~/shared/guards/AuthenticatedGuard'

import { AppNavigationItem } from './components/AppNavigationItem'

export const AppNavigation: FC = () => {
  return (
    <header className="sticky top-0 z-10 px-4 pt-4 md:px-8 md:pt-6">
      <nav className="flex items-center gap-2 overflow-x-auto rounded-full border border-border bg-card/80 px-4 py-3 backdrop-blur-md md:px-6 md:py-4">
        <div className="flex items-center gap-3">
          <AppLink
            className="rounded-full px-2 py-1 font-display font-bold tracking-[-0.02em] whitespace-nowrap hover:no-underline"
            href={routes.root}
          >
            <span className="text-muted-foreground">Lara</span>
            <span className="text-primary">stack</span>
          </AppLink>
          <AppNavigationItem href={routes.root}>Home</AppNavigationItem>
          <AppNavigationItem href={routes.terms.root}>Terms</AppNavigationItem>
          <AppNavigationItem href={routes.privacyPolicy.root}>Privacy</AppNavigationItem>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <AuthenticatedGuard fallback={<AppNavigationItem href={routes.auth.login.root}>Login</AppNavigationItem>}>
            <AppNavigationItem href={routes.dashboard.root}>Dashboard</AppNavigationItem>
            <LogoutButton size="sm" variant="soft" />
          </AuthenticatedGuard>
        </div>
      </nav>
    </header>
  )
}

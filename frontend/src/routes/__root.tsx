/// <reference types="vite/client" />
import type { ReactNode } from 'react'

import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'

import { AppNavigation } from '~/shared/components/AppNavigation'
import { GenericErrorLayout } from '~/shared/layouts/GenericErrorLayout'
import { AppProviders } from '~/shared/providers/AppProviders'
import { CsrfProvider } from '~/shared/providers/CsrfProvider'
import { NotFoundPage } from '~/shared/routes/NotFoundPage'
import appCss from '~/styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        content: 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, viewport-fit=cover',
        name: 'viewport',
      },
      { content: '#FFF6F1', name: 'theme-color' },
      {
        content: 'A playful, modern Laravel + TanStack Start starter with GraphQL and a bold design system.',
        name: 'description',
      },
      { title: 'Larastack' },
    ],
    links: [
      { href: appCss, rel: 'stylesheet' },
      { href: '/favicon.ico', rel: 'icon' },
    ],
  }),
  errorComponent: props => {
    return (
      <RootDocument>
        <GenericErrorLayout message={props.error instanceof Error ? props.error.message : undefined} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFoundPage />,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <CsrfProvider>
          <AppProviders>
            <AppNavigation />
            {children}
          </AppProviders>
        </CsrfProvider>
        <Scripts />
      </body>
    </html>
  )
}

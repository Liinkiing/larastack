import './index.css'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { AppNavigation } from '~/shared/components/AppNavigation'
import { AppProviders } from '~/shared/providers/AppProviders'
import { AuthProvider } from '~/shared/providers/AuthProvider'
import { TransitionsProvider } from '~/shared/providers/TransitionsProvider'
import { styled } from '~/styled-system/jsx'

import { fonts } from './fonts'

export const viewport: Viewport = {
  initialScale: 1,
  themeColor: '#FFF6F1',
  viewportFit: 'cover',
  width: 'device-width',
}

export const metadata: Metadata = {
  appleWebApp: {
    statusBarStyle: 'black-translucent',
  },
  description: 'A playful, modern Laravel + Next.js starter with GraphQL and a bold design system.',
  title: {
    default: 'Larastack',
    template: '%s | Larastack',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={`${fonts.body.variable} ${fonts.display.variable} ${fonts.mono.variable}`} lang="en">
      <body>
        <styled.a
          backgroundColor="bg.surface"
          borderRadius="full"
          href="#main-content"
          left={4}
          px={4}
          py={3}
          position="fixed"
          top={4}
          transform="translateY(-200%)"
          zIndex={100}
          _focusVisible={{ transform: 'translateY(0)' }}
        >
          Skip to main content
        </styled.a>
        <AppProviders>
          <AuthProvider mode="all">
            <AppNavigation />
            <TransitionsProvider>{children}</TransitionsProvider>
          </AuthProvider>
        </AppProviders>
      </body>
    </html>
  )
}

import './index.css'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { AppNavigation } from '~/shared/components/AppNavigation'
import { AppProviders } from '~/shared/providers/AppProviders'
import { CsrfProvider } from '~/shared/providers/CsrfProvider'
import { TransitionsProvider } from '~/shared/providers/TransitionsProvider'

import { fonts } from './fonts'

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
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
        <CsrfProvider>
          <AppProviders>
            <AppNavigation />
            <TransitionsProvider>{children}</TransitionsProvider>
          </AppProviders>
        </CsrfProvider>
      </body>
    </html>
  )
}

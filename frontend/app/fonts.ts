import { Fraunces, JetBrains_Mono, Spline_Sans } from 'next/font/google'

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display-family',
  weight: ['400', '500', '600', '700'],
})

const body = Spline_Sans({
  subsets: ['latin'],
  variable: '--font-body-family',
  weight: ['300', '400', '500', '600', '700'],
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-family',
  weight: ['400', '500', '600'],
})

export const fonts = {
  body,
  display,
  mono,
} as const

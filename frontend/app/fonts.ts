import { Geist, Geist_Mono } from 'next/font/google'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--fonts-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--fonts-geist-mono',
})

export const fonts = {
  geistMono,
  geistSans,
} as const

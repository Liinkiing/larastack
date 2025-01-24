import type { Metadata } from 'next'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export const metadata: Metadata = {
  title: 'Login',
}

export default function LoginLayout({ children }: Props) {
  return children
}

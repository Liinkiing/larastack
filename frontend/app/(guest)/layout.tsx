import type { ReactNode } from 'react'

import { AuthProvider } from '~/shared/providers/AuthProvider'

interface Props {
  children: ReactNode
}

export default function UnauthenticatedLayout({ children }: Props) {
  return <AuthProvider mode="guest">{children}</AuthProvider>
}

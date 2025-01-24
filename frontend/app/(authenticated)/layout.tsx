import type { ReactNode } from 'react'

import { AuthProvider } from '~/shared/providers/AuthProvider'

interface Props {
  children: ReactNode
}

export default function AuthenticatedLayout({ children }: Props) {
  return <AuthProvider mode="authenticated">{children}</AuthProvider>
}

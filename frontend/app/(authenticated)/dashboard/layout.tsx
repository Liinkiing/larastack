import type { Metadata } from 'next'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default function DashboardLayout({ children }: Props) {
  return children
}

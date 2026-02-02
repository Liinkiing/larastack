import { Outlet, createFileRoute } from '@tanstack/react-router'

import { AuthProvider } from '~/shared/providers/AuthProvider'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

function PublicLayout() {
  return <AuthProvider mode="all">{() => <Outlet />}</AuthProvider>
}

import { Outlet, createFileRoute } from '@tanstack/react-router'

import { AuthProvider } from '~/shared/providers/AuthProvider'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return <AuthProvider mode="authenticated">{() => <Outlet />}</AuthProvider>
}

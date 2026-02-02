import { Outlet, createFileRoute } from '@tanstack/react-router'

import { AuthProvider } from '~/shared/providers/AuthProvider'

export const Route = createFileRoute('/_guest')({
  component: GuestLayout,
})

function GuestLayout() {
  return <AuthProvider mode="guest">{() => <Outlet />}</AuthProvider>
}

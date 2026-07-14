import { MockedProvider } from '@apollo/client/testing/react'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import Cookies from 'js-cookie'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ViewerDocument } from '~/__generated__/gql/graphql'
import { LOGGED_IN_COOKIE_NAME } from '~/services/auth'
import { AuthenticatedGuard } from '~/shared/guards/AuthenticatedGuard'

import { AuthProvider } from './AuthProvider'

vi.mock('~/shared/components/GlobalLoader', () => ({
  GlobalLoader: () => <div role="status">Loading</div>,
}))

vi.mock('~/shared/components/Redirect', () => ({
  Redirect: ({ to }: { to: string }) => <a href={to}>Redirecting</a>,
}))

vi.mock('~/shared/layouts/GenericErrorLayout', () => ({
  GenericErrorLayout: ({ message }: { message: string }) => <div role="alert">{message}</div>,
}))

vi.mock('~/shared/env', () => ({
  compilerEnv: {
    __USE_BACKEND_PROXY__: true,
  },
}))

const NavigationAuthState = () => (
  <AuthenticatedGuard fallback={<a href="/auth/login">Login</a>}>
    <a href="/dashboard">Dashboard</a>
  </AuthenticatedGuard>
)

describe('AuthProvider', () => {
  afterEach(() => {
    cleanup()
    Cookies.remove(LOGGED_IN_COOKIE_NAME)
  })

  it('clears a stale login hint and redirects protected routes to login', async () => {
    Cookies.set(LOGGED_IN_COOKIE_NAME, 'true')
    window.history.replaceState(null, '', '/dashboard?tab=security#tokens')

    render(
      <MockedProvider
        mocks={[
          {
            request: { query: ViewerDocument },
            result: { data: { viewer: null } },
          },
        ]}
      >
        <AuthProvider mode="authenticated">
          <div>Protected content</div>
        </AuthProvider>
      </MockedProvider>,
    )

    const redirect = await screen.findByRole('link', { name: 'Redirecting' })
    await waitFor(() => {
      expect(Cookies.get(LOGGED_IN_COOKIE_NAME)).toBeUndefined()
    })

    expect(redirect.getAttribute('href')).toBe('/auth/login?return_to=%2Fdashboard%3Ftab%3Dsecurity%23tokens')
    expect(screen.queryByText('Protected content')).toBeNull()
  })

  it('keeps guest content hidden while an authenticated server render hydrates', async () => {
    Cookies.set(LOGGED_IN_COOKIE_NAME, 'true')

    const container = document.createElement('div')
    document.body.append(container)
    const tree = (
      <MockedProvider
        mocks={[
          {
            request: { query: ViewerDocument },
            result: {
              data: {
                viewer: {
                  __typename: 'User',
                  abilities: { __typename: 'UserAbilities', viewApp: true },
                  email: 'viewer@example.com',
                  id: 'viewer-id',
                  name: 'Viewer',
                },
              },
            },
          },
        ]}
      >
        <AuthProvider mode="guest">
          <div>Guest content</div>
        </AuthProvider>
      </MockedProvider>
    )

    container.innerHTML = renderToString(tree)

    expect(screen.getByRole('status')).toBeDefined()
    expect(screen.queryByText('Guest content')).toBeNull()

    const view = render(tree, { container, hydrate: true })

    const redirect = await screen.findByRole('link', { name: 'Redirecting' })

    expect(redirect.getAttribute('href')).toBe('/dashboard')
    expect(screen.queryByText('Guest content')).toBeNull()
    view.unmount()
  })

  it('keeps logged-out navigation hidden until the client auth hint is known', async () => {
    Cookies.set(LOGGED_IN_COOKIE_NAME, 'true')

    const container = document.createElement('div')
    document.body.append(container)
    const tree = (
      <MockedProvider>
        <AuthProvider mode="all">
          <NavigationAuthState />
        </AuthProvider>
      </MockedProvider>
    )

    container.innerHTML = renderToString(tree)

    expect(screen.queryByRole('link', { name: 'Login' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Dashboard' })).toBeNull()

    const view = render(tree, { container, hydrate: true })

    expect(await screen.findByRole('link', { name: 'Dashboard' })).toBeDefined()
    expect(screen.queryByRole('link', { name: 'Login' })).toBeNull()
    view.unmount()
  })

  it('reveals logged-out navigation after the client auth hint is known', async () => {
    const container = document.createElement('div')
    document.body.append(container)
    const tree = (
      <MockedProvider>
        <AuthProvider mode="all">
          <NavigationAuthState />
        </AuthProvider>
      </MockedProvider>
    )

    container.innerHTML = renderToString(tree)

    expect(screen.queryByRole('link', { name: 'Login' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Dashboard' })).toBeNull()

    const view = render(tree, { container, hydrate: true })

    expect(await screen.findByRole('link', { name: 'Login' })).toBeDefined()
    expect(screen.queryByRole('link', { name: 'Dashboard' })).toBeNull()
    view.unmount()
  })
})

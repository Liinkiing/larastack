import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { AuthenticationState } from '~/shared/providers/AuthProvider'
import { AuthContext } from '~/shared/providers/AuthProvider'

import { AuthenticatedGuard } from './AuthenticatedGuard'
import { GuestGuard } from './GuestGuard'

vi.mock('~/shared/env', () => ({
  compilerEnv: {
    __USE_BACKEND_PROXY__: true,
  },
}))

const renderGuards = (isAuthenticated: AuthenticationState) => {
  return render(
    <AuthContext.Provider value={{ isAuthenticated, viewer: null }}>
      <AuthenticatedGuard fallback={<div>Authenticated fallback</div>}>
        <div>Authenticated content</div>
      </AuthenticatedGuard>
      <GuestGuard fallback={<div>Guest fallback</div>}>
        <div>Guest content</div>
      </GuestGuard>
    </AuthContext.Provider>,
  )
}

describe('auth guards', () => {
  afterEach(cleanup)

  it('renders neither branch while authentication is unknown', () => {
    renderGuards(null)

    expect(screen.queryByText('Authenticated content')).toBeNull()
    expect(screen.queryByText('Authenticated fallback')).toBeNull()
    expect(screen.queryByText('Guest content')).toBeNull()
    expect(screen.queryByText('Guest fallback')).toBeNull()
  })

  it('renders authenticated branches after authentication is confirmed', () => {
    renderGuards(true)

    expect(screen.getByText('Authenticated content')).toBeDefined()
    expect(screen.getByText('Guest fallback')).toBeDefined()
    expect(screen.queryByText('Authenticated fallback')).toBeNull()
    expect(screen.queryByText('Guest content')).toBeNull()
  })

  it('renders guest branches after authentication is rejected', () => {
    renderGuards(false)

    expect(screen.getByText('Authenticated fallback')).toBeDefined()
    expect(screen.getByText('Guest content')).toBeDefined()
    expect(screen.queryByText('Authenticated content')).toBeNull()
    expect(screen.queryByText('Guest fallback')).toBeNull()
  })
})

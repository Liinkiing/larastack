import { use, useCallback, useMemo } from 'react'

import { graphql } from '~/__generated__/gql'
import type { AuthProvider } from '~/services/auth'
import { AuthService } from '~/services/auth'
import type { AuthenticationState, Viewer } from '~/shared/providers/AuthProvider'
import { AuthContext } from '~/shared/providers/AuthProvider'

type Return = {
  isAuthenticated: AuthenticationState
  viewer: Viewer | null
  loginWithProvider: typeof AuthService.loginWithProvider
  login: (args: { email: string; password: string }) => Promise<void>
  logout: typeof AuthService.logout
}

export const useAuth = (): Return => {
  const context = use(AuthContext)

  const logout = useCallback(() => {
    return AuthService.logout()
  }, [])

  const loginWithProvider = useCallback((provider: AuthProvider) => {
    return AuthService.loginWithProvider(provider)
  }, [])

  const login = useCallback(({ email, password }: { email: string; password: string }) => {
    const returnTo = new URLSearchParams(window.location.search).get('return_to')
    return AuthService.login({
      email,
      password,
      returnTo,
    })
  }, [])

  return useMemo<Return>(
    () => ({
      isAuthenticated: context.isAuthenticated,
      login,
      loginWithProvider,
      logout,
      viewer: context.viewer,
    }),
    [context.isAuthenticated, context.viewer, login, loginWithProvider, logout],
  )
}

export const useViewer = (): Viewer => {
  const { viewer } = useAuth()

  if (!viewer) {
    throw new Error('useViewer must only be called from an authenticated route with a loaded viewer.')
  }

  return viewer
}

graphql(`
  query Viewer {
    viewer {
      id
      email
      name
      abilities {
        viewApp
      }
    }
  }
`)

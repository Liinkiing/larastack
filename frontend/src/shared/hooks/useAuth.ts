import { use, useCallback, useMemo } from 'react'

import { graphql } from '~/__generated__/gql'
import type { AuthProvider } from '~/services/auth'
import { AuthService } from '~/services/auth'
import type { Viewer } from '~/shared/providers/AuthProvider'
import { AuthContext } from '~/shared/providers/AuthProvider'

type Return<T = Viewer> = {
  isAuthenticated: boolean
  viewer: T
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
      isAuthenticated: AuthService.isLoggedIn,
      login,
      loginWithProvider,
      logout,
      viewer: context.viewer as NonNullable<Viewer>,
    }),
    [context.viewer, login, loginWithProvider, logout],
  )
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

import Cookies from 'js-cookie'
import { routes } from '~app/routes'

import { ApiService } from '~/services/api'
import { compilerEnv } from '~/shared/env'

export const LOGIN_URL = routes.auth.login.root
export const LOGGED_IN_URL = routes.root
export const FALLBACK_URL = routes.auth.login.root

export type AuthProvider = 'google'

class AuthServiceApp {
  get isLoggedIn(): boolean {
    if (typeof document === 'undefined') return false
    const isLoggedIn = Cookies.get('larastack_logged_in')

    return isLoggedIn === 'true'
  }

  public async login({
    email,
    password,
    returnTo,
  }: {
    email: string
    password: string
    returnTo?: string | null
  }): Promise<void> {
    const { error } = await ApiService.login({ email, password })
    if (error) {
      throw error
    } else {
      window.location.href = returnTo ?? LOGGED_IN_URL
    }
  }

  public loginWithProvider(provider: AuthProvider): void {
    if (compilerEnv.__USE_BACKEND_PROXY__) {
      window.location.pathname = `/api/auth/${provider}/redirect`
    } else {
      const url = new URL(window.location.href)
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}/redirect${url.search}`
    }
  }

  public async logout(): Promise<any> {
    await ApiService.logout()

    window.location.pathname = FALLBACK_URL
  }
}

export const AuthService = new AuthServiceApp()

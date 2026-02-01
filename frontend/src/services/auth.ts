import Cookies from 'js-cookie'

import { ApiService } from '~/services/api'
import { compilerEnv } from '~/shared/env'
import { routes } from '~app/routes'

export const LOGIN_URL = routes.auth.login.root
export const LOGGED_IN_URL = routes.root
export const FALLBACK_URL = routes.auth.login.root

export type AuthProvider = 'google'

class AuthServiceApp {
  get isLoggedIn(): boolean {
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
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}/redirect${url.search}`
    }
  }

  public async logout(): Promise<any> {
    await ApiService.logout()

    window.location.pathname = FALLBACK_URL
  }
}

export const AuthService = new AuthServiceApp()

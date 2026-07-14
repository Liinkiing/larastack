import Cookies from 'js-cookie'
import { routes } from '~app/routes'

import { ApiService } from '~/services/api'
import { compilerEnv } from '~/shared/env'
import { resolveSafeReturnPath } from '~/utils/url'

export const LOGIN_URL = routes.auth.login.root
export const LOGGED_IN_URL = routes.dashboard.root
export const FALLBACK_URL = routes.auth.login.root
export const LOGGED_IN_COOKIE_NAME = 'larastack_logged_in'

export type AuthProvider = 'google'

class AuthServiceApp {
  private readonly authHintListeners = new Set<() => void>()

  get isLoggedIn(): boolean {
    const isLoggedIn = Cookies.get(LOGGED_IN_COOKIE_NAME)

    return isLoggedIn === 'true'
  }

  public clearLoggedInHint(): void {
    Cookies.remove(LOGGED_IN_COOKIE_NAME)
    for (const listener of this.authHintListeners) {
      listener()
    }
  }

  public subscribeToLoggedInHint(listener: () => void): () => void {
    this.authHintListeners.add(listener)

    return () => {
      this.authHintListeners.delete(listener)
    }
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
    await ApiService.csrf()
    const { error } = await ApiService.login({ email, password })
    if (error) {
      throw new Error(error)
    }

    window.location.href = resolveSafeReturnPath(returnTo, LOGGED_IN_URL, window.location.origin)
  }

  public loginWithProvider(provider: AuthProvider): void {
    if (compilerEnv.__USE_BACKEND_PROXY__) {
      window.location.pathname = `/api/auth/${provider}/redirect`
    } else {
      const redirectUrl = new URL(`/auth/${provider}/redirect`, ApiService.baseUrl)
      redirectUrl.search = window.location.search
      window.location.href = redirectUrl.href
    }
  }

  public async logout(): Promise<void> {
    await ApiService.csrf()
    await ApiService.logout()

    window.location.pathname = FALLBACK_URL
  }
}

export const AuthService = new AuthServiceApp()

import type { PropsWithChildren } from 'react'

import { createContext, useContext, useEffect, useState } from 'react'

import {
  clearAccessToken,
  exchangeGoogleIdToken,
  fetchCurrentUser,
  getPersistedAccessToken,
  persistAccessToken,
  revokeCurrentToken,
  type MobileAuthUser,
} from '~/services/auth'
import { signInWithGoogle, signOutFromGoogle } from '~/services/google-signin'

type AuthContextValue = {
  user: MobileAuthUser | null
  authError: string | null
  isHydratingSession: boolean
  isAuthenticating: boolean
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  clearAuthError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<MobileAuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [isHydratingSession, setIsHydratingSession] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const token = await getPersistedAccessToken()
        if (!token) {
          return
        }

        const authenticatedUser = await fetchCurrentUser(token)
        setAccessToken(token)
        setUser(authenticatedUser)
      } catch {
        await clearAccessToken()
        setAccessToken(null)
        setUser(null)
      } finally {
        setIsHydratingSession(false)
      }
    }

    void hydrateSession()
  }, [])

  const loginWithGoogle = async () => {
    setIsAuthenticating(true)
    setAuthError(null)

    try {
      const idToken = await signInWithGoogle()
      const { token, user: authenticatedUser } = await exchangeGoogleIdToken(idToken)

      await persistAccessToken(token)
      setAccessToken(token)
      setUser(authenticatedUser)
    } catch (error) {
      if (error instanceof Error && error.message === 'Google sign-in was cancelled.') {
        return
      }

      setAuthError(error instanceof Error ? error.message : 'Authentication failed. Please try again.')
    } finally {
      setIsAuthenticating(false)
    }
  }

  const logout = async () => {
    setIsAuthenticating(true)
    setAuthError(null)

    try {
      if (accessToken) {
        await revokeCurrentToken(accessToken)
      }

      await signOutFromGoogle()
      await clearAccessToken()
      setAccessToken(null)
      setUser(null)
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to sign out right now.')
    } finally {
      setIsAuthenticating(false)
    }
  }

  const clearAuthError = () => setAuthError(null)

  const value: AuthContextValue = {
    user,
    authError,
    isHydratingSession,
    isAuthenticating,
    loginWithGoogle,
    logout,
    clearAuthError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.')
  }

  return context
}

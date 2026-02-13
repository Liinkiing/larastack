import { createContext, type PropsWithChildren, use, useEffect, useState } from 'react'

import { apolloClient } from '~/apollo/client'
import {
  clearAccessToken,
  exchangeGoogleIdToken,
  fetchCurrentUser,
  getPersistedAccessToken,
  persistAccessToken,
  revokeCurrentToken,
} from '~/services/auth'
import { onAuthSessionInvalidated } from '~/services/auth-session'
import { signInWithGoogle, signOutFromGoogle } from '~/services/google-signin'

type OAuthContextValue = {
  error: string | null
  isHydratingSession: boolean
  isLoading: boolean
  isAuthenticated: boolean
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const OAuthContext = createContext<OAuthContextValue | null>(null)

export function OAuthProvider({ children }: PropsWithChildren) {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [isHydratingSession, setIsHydratingSession] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const token = await getPersistedAccessToken()

        if (!token) {
          setAccessToken(null)
          return
        }

        await fetchCurrentUser(token)
        setAccessToken(token)
      } catch {
        await clearAccessToken()
        setAccessToken(null)
      } finally {
        setIsHydratingSession(false)
      }
    }

    void hydrateSession()
  }, [])

  useEffect(() => {
    return onAuthSessionInvalidated(() => {
      const invalidateSession = async () => {
        await clearAccessToken()
        setAccessToken(null)
        setAuthError('Session expired. Please sign in again.')
        await apolloClient.clearStore()
      }

      void invalidateSession()
    })
  }, [])

  const loginWithGoogle = async () => {
    setIsLoading(true)
    setAuthError(null)

    try {
      const idToken = await signInWithGoogle()
      const { token } = await exchangeGoogleIdToken(idToken)

      await persistAccessToken(token)
      setAccessToken(token)
      await apolloClient.clearStore()
    } catch (error) {
      if (error instanceof Error && error.message === 'Google sign-in was cancelled.') {
        return
      }

      setAuthError(error instanceof Error ? error.message : 'Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    setAuthError(null)

    try {
      if (accessToken) {
        await revokeCurrentToken(accessToken)
      }

      await signOutFromGoogle()
      await clearAccessToken()
      await apolloClient.clearStore()
      setAccessToken(null)
    } catch (error) {
      if (error instanceof Error && error.message === 'ERR_REVOKE_TOKEN_FAILED') {
        await signOutFromGoogle()
        await clearAccessToken()
        await apolloClient.clearStore()
        setAccessToken(null)
      } else {
        setAuthError(error instanceof Error ? error.message : 'Unable to sign out right now.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clearAuthError = () => setAuthError(null)

  const value: OAuthContextValue = {
    error: authError,
    clearError: clearAuthError,
    isLoading: isLoading,
    isAuthenticated: Boolean(accessToken),
    isHydratingSession,
    loginWithGoogle,
    logout,
  }

  return <OAuthContext.Provider value={value}>{children}</OAuthContext.Provider>
}

export function useOAuth(): OAuthContextValue {
  const context = use(OAuthContext)

  if (!context) {
    throw new Error('useOAuth must be used inside <OAuthProvider />.')
  }

  return context
}

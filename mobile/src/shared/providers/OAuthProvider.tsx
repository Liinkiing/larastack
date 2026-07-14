import { createContext, type PropsWithChildren, use, useEffect, useState } from 'react'

import { apolloClient } from '~/apollo/client'
import { isAppleSignInAvailable, signInWithApple } from '~/services/apple-signin'
import {
  clearAccessToken,
  exchangeAppleIdentityToken,
  exchangeGoogleIdToken,
  fetchCurrentUser,
  getPersistedAccessToken,
  InvalidAccessTokenError,
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
  isAppleLoginAvailable: boolean
  loginWithGoogle: () => Promise<void>
  loginWithApple: () => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const OAuthContext = createContext<OAuthContextValue | null>(null)

export function OAuthProvider({ children }: PropsWithChildren) {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [isHydratingSession, setIsHydratingSession] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isAppleLoginAvailable, setIsAppleLoginAvailable] = useState(false)

  useEffect(() => {
    if (process.env.EXPO_OS !== 'ios') {
      return
    }

    const resolveAppleAvailability = async () => {
      const isAvailable = await isAppleSignInAvailable()
      setIsAppleLoginAvailable(isAvailable)
    }

    void resolveAppleAvailability()
  }, [])

  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const token = await getPersistedAccessToken()

        if (!token) {
          setAccessToken(null)
          return
        }

        try {
          await fetchCurrentUser(token)
          setAccessToken(token)
        } catch (error) {
          if (error instanceof InvalidAccessTokenError) {
            setAccessToken(null)
            await clearAccessToken()
          } else {
            setAuthError('Unable to verify your session. Check your connection and try again.')
          }
        }
      } catch (error) {
        setAccessToken(null)
        setAuthError(error instanceof Error ? error.message : 'Unable to restore the saved session.')
      } finally {
        setIsHydratingSession(false)
      }
    }

    void hydrateSession()
  }, [])

  useEffect(() => {
    return onAuthSessionInvalidated(() => {
      const invalidateSession = async () => {
        setAccessToken(null)
        setAuthError('Session expired. Please sign in again.')
        await Promise.allSettled([clearAccessToken(), apolloClient.clearStore()])
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

  const loginWithApple = async () => {
    setIsLoading(true)
    setAuthError(null)

    try {
      const applePayload = await signInWithApple()
      const { token } = await exchangeAppleIdentityToken(applePayload)

      await persistAccessToken(token)
      setAccessToken(token)
      await apolloClient.clearStore()
    } catch (error) {
      const cancelled =
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string }).code === 'ERR_REQUEST_CANCELED'

      if (cancelled) {
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

    const tokenToRevoke = accessToken
    const remoteTasks = [signOutFromGoogle()]
    if (tokenToRevoke) {
      remoteTasks.push(revokeCurrentToken(tokenToRevoke))
    }

    const remoteCleanup = Promise.allSettled(remoteTasks)

    setAccessToken(null)
    const localResults = await Promise.allSettled([clearAccessToken(), apolloClient.clearStore()])

    if (localResults.some(result => result.status === 'rejected')) {
      setAuthError('Signed out in this session, but the saved session could not be fully cleared.')
    }

    setIsLoading(false)

    const remoteResults = await remoteCleanup
    if (
      localResults.every(result => result.status === 'fulfilled') &&
      remoteResults.some(result => result.status === 'rejected')
    ) {
      setAuthError('Signed out locally, but the server or Google session could not be revoked.')
    }
  }

  const clearAuthError = () => setAuthError(null)

  const value: OAuthContextValue = {
    error: authError,
    clearError: clearAuthError,
    isLoading: isLoading,
    isAuthenticated: Boolean(accessToken),
    isAppleLoginAvailable,
    isHydratingSession,
    loginWithApple,
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

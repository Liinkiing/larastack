import { createContext, type PropsWithChildren, use, useEffect, useEffectEvent, useRef, useState } from 'react'
import { AppState } from 'react-native'

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
  const [shouldRetrySession, setShouldRetrySession] = useState(false)
  const isRestoringSession = useRef(false)
  const isChangingSession = useRef(false)
  const sessionGeneration = useRef(0)
  const sessionCleanup = useRef(Promise.resolve())

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

  const restoreSession = useEffectEvent(async () => {
    if (isRestoringSession.current || isChangingSession.current) {
      return
    }

    isRestoringSession.current = true
    const generation = sessionGeneration.current

    try {
      const token = await getPersistedAccessToken()
      if (generation !== sessionGeneration.current) {
        return
      }

      if (token) {
        await fetchCurrentUser(token)
      }

      if (generation === sessionGeneration.current) {
        setAccessToken(token)
        setShouldRetrySession(false)
        setAuthError(null)
      }
    } catch (error) {
      if (generation !== sessionGeneration.current) {
        return
      }

      if (error instanceof InvalidAccessTokenError) {
        setAccessToken(null)
        setShouldRetrySession(false)
        setAuthError('Session expired. Please sign in again.')
        try {
          await clearAccessToken()
        } catch {
          if (generation === sessionGeneration.current) {
            setAuthError('The saved session could not be cleared. Please sign in again.')
          }
        }
      } else {
        setShouldRetrySession(true)
        setAuthError('Unable to verify your session. Check your connection and try again.')
      }
    } finally {
      isRestoringSession.current = false
    }
  })

  const retrySessionOnForeground = useEffectEvent(() => {
    if (shouldRetrySession) {
      void restoreSession()
    }
  })

  useEffect(() => {
    if (!isRestoringSession.current) {
      void restoreSession().finally(() => setIsHydratingSession(false))
    }

    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        retrySessionOnForeground()
      }
    })

    return () => subscription.remove()
  }, [])

  useEffect(() => {
    return onAuthSessionInvalidated(() => {
      sessionGeneration.current += 1
      setAccessToken(null)
      setShouldRetrySession(false)
      setAuthError('Session expired. Please sign in again.')
      sessionCleanup.current = Promise.allSettled([clearAccessToken(), apolloClient.clearStore()]).then(() => undefined)
    })
  }, [])

  const login = async (getToken: () => Promise<string>, isCancelled: (error: unknown) => boolean) => {
    if (isChangingSession.current) {
      return
    }

    isChangingSession.current = true
    const generation = ++sessionGeneration.current
    setIsLoading(true)
    setAuthError(null)

    try {
      const token = await getToken()
      await sessionCleanup.current
      await apolloClient.clearStore()
      if (generation !== sessionGeneration.current) {
        return
      }

      await persistAccessToken(token)
      if (generation === sessionGeneration.current) {
        setAccessToken(token)
        setShouldRetrySession(false)
      }
    } catch (error) {
      if (generation === sessionGeneration.current && !isCancelled(error)) {
        setAuthError(error instanceof Error ? error.message : 'Authentication failed. Please try again.')
      }
    } finally {
      isChangingSession.current = false
      setIsLoading(false)
    }
  }

  const loginWithGoogle = () =>
    login(
      async () => (await exchangeGoogleIdToken(await signInWithGoogle())).token,
      error => error instanceof Error && error.message === 'Google sign-in was cancelled.',
    )

  const loginWithApple = () =>
    login(
      async () => (await exchangeAppleIdentityToken(await signInWithApple())).token,
      error => typeof error === 'object' && error !== null && 'code' in error && error.code === 'ERR_REQUEST_CANCELED',
    )

  const logout = async () => {
    if (isChangingSession.current) {
      return
    }

    isChangingSession.current = true
    const generation = ++sessionGeneration.current
    setIsLoading(true)
    setAuthError(null)
    setShouldRetrySession(false)

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

    isChangingSession.current = false
    setIsLoading(false)

    const remoteResults = await remoteCleanup
    if (
      generation === sessionGeneration.current &&
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

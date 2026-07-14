'use client'

import { useQuery } from '@apollo/client/react'
import type { FC, ReactNode } from 'react'
import { createContext, useEffect, useMemo, useSyncExternalStore } from 'react'

import type { ViewerQuery } from '~/__generated__/gql/graphql'
import { ViewerDocument } from '~/__generated__/gql/graphql'
import { AuthService, LOGGED_IN_URL, LOGIN_URL } from '~/services/auth'
import { GlobalLoader } from '~/shared/components/GlobalLoader'
import { Redirect } from '~/shared/components/Redirect'
import { GenericErrorLayout } from '~/shared/layouts/GenericErrorLayout'

export type Viewer = NonNullable<ViewerQuery['viewer']>
export type AuthenticationState = boolean | null

interface Props {
  children: ReactNode
  mode: 'guest' | 'authenticated' | 'all'
}

interface Context {
  isAuthenticated: AuthenticationState
  viewer: Viewer | null
}

export const AuthContext = createContext<Context>({
  isAuthenticated: null,
  viewer: null,
})

const subscribeToAuthHint = (onStoreChange: () => void) => AuthService.subscribeToLoggedInHint(onStoreChange)

export const AuthProvider: FC<Props> = ({ children, mode }) => {
  const hasLoggedInHint = useSyncExternalStore<boolean | null>(
    subscribeToAuthHint,
    () => AuthService.isLoggedIn,
    () => null,
  )
  // Root consumers only need the navigation hint; route-local providers verify protected/guest sessions.
  const shouldVerifySession = mode !== 'all' && hasLoggedInHint === true
  const { data, error, loading } = useQuery(ViewerDocument, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    skip: !shouldVerifySession,
  })

  const sessionRejected = shouldVerifySession && !loading && data !== undefined && !data.viewer
  const isAuthenticated =
    mode === 'all' ? hasLoggedInHint : hasLoggedInHint === true && !sessionRejected && Boolean(data?.viewer)

  useEffect(() => {
    if (!sessionRejected) {
      return
    }

    AuthService.clearLoggedInHint()
  }, [sessionRejected])

  const context = useMemo<Context>(
    () => ({
      isAuthenticated,
      viewer: data?.viewer ?? null,
    }),
    [data, isAuthenticated],
  )

  if (mode === 'all') {
    return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  }

  if (hasLoggedInHint === null) {
    return <GlobalLoader />
  }

  if (loading) {
    return <GlobalLoader />
  }

  if ((!hasLoggedInHint || sessionRejected) && mode === 'authenticated') {
    const returnPath =
      typeof window === 'undefined'
        ? LOGGED_IN_URL
        : `${window.location.pathname}${window.location.search}${window.location.hash}`
    const redirectUrl = `${LOGIN_URL}?return_to=${encodeURIComponent(returnPath)}`
    return <Redirect to={redirectUrl} />
  }

  if ((!hasLoggedInHint || sessionRejected) && mode === 'guest') {
    return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  }

  if (error) {
    return <GenericErrorLayout message={error.message} />
  }

  if (isAuthenticated === true && mode === 'guest') {
    return <Redirect to={LOGGED_IN_URL} />
  }

  if (isAuthenticated === false && mode === 'authenticated') {
    return <GenericErrorLayout message="The authenticated session could not be verified." />
  }

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}

'use client'

import { useQuery } from '@apollo/client'
import { runIfFn } from '@zag-js/utils'
import type { FC, ReactNode } from 'react'
import { createContext, useMemo } from 'react'

import type { ViewerQuery } from '~/__generated__/gql/graphql'
import { ViewerDocument } from '~/__generated__/gql/graphql'
import { AuthService, LOGGED_IN_URL, LOGIN_URL } from '~/services/auth'
import { GlobalLoader } from '~/shared/components/GlobalLoader'
import { Redirect } from '~/shared/components/Redirect'
import { GenericErrorLayout } from '~/shared/layouts/GenericErrorLayout'

export type Viewer = NonNullable<ViewerQuery['viewer']>

type RenderProps = ReactNode | ((viewer: Viewer) => ReactNode)

interface Props {
  children: RenderProps
  mode: 'guest' | 'authenticated' | 'all'
}

interface Context {
  viewer: Viewer | null
}

export const AuthContext = createContext<Context>({
  viewer: null,
})

export const AuthProvider: FC<Props> = ({ children, mode }) => {
  const { data, error, loading } = useQuery(ViewerDocument, {
    skip: mode === 'guest' || !AuthService.isLoggedIn,
  })

  const context = useMemo<Context>(
    () => ({
      viewer: data?.viewer ?? null,
    }),
    [data],
  )

  if (loading) {
    return <GlobalLoader />
  }

  if (!AuthService.isLoggedIn && mode === 'authenticated') {
    const redirectUrl = `${LOGIN_URL}?return_to=${encodeURIComponent(window.location.pathname)}`
    return <Redirect to={redirectUrl} />
  }

  if (AuthService.isLoggedIn && mode === 'guest') {
    return <Redirect to={LOGGED_IN_URL} />
  }

  if (error) {
    return <GenericErrorLayout message={error?.message} />
  }

  return <AuthContext.Provider value={context}>{runIfFn(children, context.viewer!)}</AuthContext.Provider>
}

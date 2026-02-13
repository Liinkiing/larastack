import { skipToken, useSuspenseQuery } from '@apollo/client/react'
import { Redirect } from 'expo-router'

import { graphql } from '~/__generated__/gql'
import { MobileAuthViewerDocument, type MobileAuthViewerQuery } from '~/__generated__/gql/graphql'
import { useOAuth } from '~/shared/providers/OAuthProvider'

export type Viewer = NonNullable<MobileAuthViewerQuery['viewer']>

type UseAuthReturn = {
  viewer: Viewer
}

graphql(`
  query MobileAuthViewer {
    viewer {
      id
      name
      email
      abilities {
        viewApp
      }
    }
  }
`)

export function useAuth(): UseAuthReturn {
  const { isAuthenticated } = useOAuth()
  const { data } = useSuspenseQuery(
    MobileAuthViewerDocument,
    isAuthenticated
      ? {
          fetchPolicy: 'cache-and-network',
        }
      : skipToken,
  )

  if (!data?.viewer) {
    console.error(
      'Trying to access viewer data while not authenticated. useAuth should only be used within <OAuthProvider /> and when the user is authenticated.',
    )

    return (<Redirect href="/login" />) as unknown as UseAuthReturn
  }

  return {
    viewer: data.viewer,
  }
}

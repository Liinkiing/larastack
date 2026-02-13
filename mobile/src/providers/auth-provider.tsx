import { skipToken, useSuspenseQuery } from '@apollo/client/react'

import { graphql } from '~/__generated__/gql'
import { MobileAuthViewerDocument, MobileAuthViewerQuery } from '~/__generated__/gql/graphql'
import { useOAuth } from '~/providers/oauth-provider'

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
    throw new Error(
      'Trying to access viewer data while not authenticated. useAuth should only be used within <OAuthProvider /> and when the user is authenticated.',
    )
  }

  return {
    viewer: data.viewer,
  }
}

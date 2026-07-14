import { skipToken, useSuspenseQuery } from '@apollo/client/react'

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

  if (!isAuthenticated) {
    throw new Error('useAuth must only be called from an authenticated route.')
  }

  if (!data?.viewer) {
    throw new Error('The authenticated viewer query returned no viewer.')
  }

  return {
    viewer: data.viewer,
  }
}

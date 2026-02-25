import { ApolloProvider } from '@apollo/client/react'
import type { PropsWithChildren } from 'react'

import { apolloClient } from '~/apollo/client'

export function ApolloAppProvider({ children }: PropsWithChildren) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}

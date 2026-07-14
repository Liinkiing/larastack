import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client'
import { LocalState } from '@apollo/client/local-state'
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs'

import introspection from '~/__generated__/gql/possibleTypes.json'
import { errorLink } from '~/apollo/links'
import { typePolicies } from '~/apollo/policies'
import { fetchWithXsrf } from '~/services/csrf'
import { compilerEnv } from '~/shared/env'

const graphqlEndpoint = compilerEnv.__USE_BACKEND_PROXY__
  ? '/api/graphql'
  : process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.trim()

if (!graphqlEndpoint) {
  throw new Error('NEXT_PUBLIC_GRAPHQL_ENDPOINT must be configured when the backend proxy is disabled.')
}

const httpLink = new UploadHttpLink({
  credentials: 'include',
  fetch: fetchWithXsrf,
  uri: graphqlEndpoint,
})

export const apolloClient = new ApolloClient({
  localState: new LocalState(),
  cache: new InMemoryCache({
    possibleTypes: introspection.possibleTypes,
    typePolicies,
  }),
  dataMasking: true,
  defaultOptions: {
    query: {
      fetchPolicy: 'cache-first',
    },
  },
  devtools: {
    enabled: compilerEnv.__DEV__,
    name: process.env.NEXT_PUBLIC_APP_NAME,
  },
  link: ApolloLink.from([errorLink, httpLink]),
  ssrMode: typeof window === 'undefined',
})

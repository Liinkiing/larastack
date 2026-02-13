import { ApolloClient, ApolloLink, CombinedGraphQLErrors, HttpLink, InMemoryCache, ServerError } from '@apollo/client'
import { SetContextLink } from '@apollo/client/link/context'
import { ErrorLink } from '@apollo/client/link/error'

import introspection from '~/__generated__/gql/possibleTypes.json'
import { getPersistedAccessToken } from '~/services/auth'
import { notifyAuthSessionInvalidated } from '~/services/auth-session'

const graphqlEndpoint = process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT ?? `${process.env.EXPO_PUBLIC_API_URL}/graphql`

if (!graphqlEndpoint) {
  throw new Error('GraphQL endpoint is not configured. Set EXPO_PUBLIC_API_URL or EXPO_PUBLIC_GRAPHQL_ENDPOINT.')
}

const httpLink = new HttpLink({
  uri: graphqlEndpoint,
})

const authLink = new SetContextLink(async ({ headers }) => {
  const token = await getPersistedAccessToken()

  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      Accept: 'application/json',
    },
  }
})

const sessionInvalidationLink = new ErrorLink(({ error }) => {
  if (ServerError.is(error) && error.statusCode === 401) {
    notifyAuthSessionInvalidated()
    return
  }

  if (!CombinedGraphQLErrors.is(error)) {
    return
  }

  const hasUnauthenticatedError = error.errors.some(graphqlError => {
    if (graphqlError.extensions?.code === 'UNAUTHENTICATED') {
      return true
    }

    return graphqlError.message.toLowerCase().includes('unauthenticated')
  })

  if (hasUnauthenticatedError) {
    notifyAuthSessionInvalidated()
  }
})

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache({
    possibleTypes: introspection.possibleTypes,
  }),
  dataMasking: true,
  defaultOptions: {
    query: {
      fetchPolicy: 'cache-first',
    },
  },
  link: ApolloLink.from([authLink, sessionInvalidationLink, httpLink]),
})

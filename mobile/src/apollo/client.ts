import { ApolloClient, ApolloLink, CombinedGraphQLErrors, HttpLink, InMemoryCache, ServerError } from '@apollo/client'
import { SetContextLink } from '@apollo/client/link/context'
import { ErrorLink } from '@apollo/client/link/error'
import { LocalState } from '@apollo/client/local-state'

import introspection from '~/__generated__/gql/possibleTypes.json'
import { resolveGraphqlEndpoint } from '~/apollo/endpoint'
import { typePolicies } from '~/apollo/policies'
import { getPersistedAccessToken, invalidateCachedAccessToken } from '~/services/auth'
import { notifyAuthSessionInvalidated } from '~/services/auth-session'

const graphqlEndpoint = resolveGraphqlEndpoint({
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL,
  graphqlEndpoint: process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT,
})

const httpLink = new HttpLink({
  uri: graphqlEndpoint,
})

const authLink = new SetContextLink(async ({ headers }) => {
  const token = await getPersistedAccessToken()

  return {
    authSessionToken: token,
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      Accept: 'application/json',
    },
  }
})

const sessionInvalidationLink = new ErrorLink(({ error, operation }) => {
  const isUnauthenticated =
    (ServerError.is(error) && error.statusCode === 401) ||
    (CombinedGraphQLErrors.is(error) &&
      error.errors.some(
        graphqlError =>
          graphqlError.extensions?.code === 'UNAUTHENTICATED' ||
          graphqlError.message.toLowerCase().includes('unauthenticated'),
      ))
  const token = operation.getContext().authSessionToken

  if (isUnauthenticated && typeof token === 'string' && invalidateCachedAccessToken(token)) {
    notifyAuthSessionInvalidated()
  }
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
  link: ApolloLink.from([authLink, sessionInvalidationLink, httpLink]),
})

import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client'
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs'
import Cookies from 'js-cookie'

import introspection from '~/__generated__/gql/possibleTypes.json'
import { errorLink } from '~/apollo/links'
import { typePolicies } from '~/apollo/policies'
import { compilerEnv } from '~/shared/env'

export const XSRF_TOKEN_COOKIE_NAME = 'XSRF-TOKEN'

const customFetch: typeof fetch = (uri, options) => {
  if (typeof document === 'undefined') {
    return fetch(uri, options)
  }

  const headers = new Headers(options?.headers)
  const xsrfToken = Cookies.get(XSRF_TOKEN_COOKIE_NAME)
  if (xsrfToken) {
    headers.set('X-XSRF-TOKEN', xsrfToken)
  }

  return fetch(uri, {
    ...options,
    headers,
  })
}

const httpLink = new UploadHttpLink({
  credentials: 'include',
  fetch: customFetch,
  uri: compilerEnv.__USE_BACKEND_PROXY__ ? '/api/graphql' : import.meta.env.VITE_GRAPHQL_ENDPOINT,
})

export const apolloClient = new ApolloClient({
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
    name: import.meta.env.VITE_APP_NAME,
  },
  link: ApolloLink.from([errorLink, httpLink]),
  ssrMode: typeof window === 'undefined',
})

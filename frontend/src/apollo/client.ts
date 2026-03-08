import * as http from 'node:http'
import * as https from 'node:https'

import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client'
import { LocalState } from '@apollo/client/local-state'
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs'
import Cookies from 'js-cookie'

import introspection from '~/__generated__/gql/possibleTypes.json'
import { errorLink } from '~/apollo/links'
import { typePolicies } from '~/apollo/policies'
import { compilerEnv } from '~/shared/env'

export const XSRF_TOKEN_COOKIE_NAME = 'XSRF-TOKEN'

const customFetch: typeof fetch = (uri, options) => {
  // @ts-ignore
  options.headers['X-XSRF-TOKEN'] = Cookies.get(XSRF_TOKEN_COOKIE_NAME)

  return fetch(uri, options)
}

const httpLink = new UploadHttpLink({
  credentials: 'include',
  fetch: customFetch,
  fetchOptions: {
    agent: compilerEnv.__DEV__ ? new http.Agent() : new https.Agent({ rejectUnauthorized: !compilerEnv.__DEV__ }),
  } as RequestInit,
  uri: compilerEnv.__USE_BACKEND_PROXY__ ? '/api/graphql' : process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
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

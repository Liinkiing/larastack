import { ApolloClient, ApolloLink, gql, InMemoryCache, Observable } from '@apollo/client'
import { describe, expect, it, vi } from 'vitest'

import errorLink from './error'

vi.mock('~/shared/env', () => ({
  compilerEnv: {
    __DEV__: false,
  },
}))

describe('errorLink', () => {
  it('reports a GraphQL error without retrying the operation', async () => {
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => {})
    let executions = 0
    const terminalLink = new ApolloLink(
      () =>
        new Observable(observer => {
          executions += 1
          observer.next({ errors: [{ message: 'Boom' }] })
          observer.complete()
        }),
    )

    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.from([errorLink, terminalLink]),
    })

    await client.query({
      errorPolicy: 'all',
      fetchPolicy: 'no-cache',
      query: gql`
        query TestErrorLink {
          __typename
        }
      `,
    })

    expect(executions).toBe(1)
    expect(alert).toHaveBeenCalledOnce()
    expect(alert).toHaveBeenCalledWith('Boom')
  })
})

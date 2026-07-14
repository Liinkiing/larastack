import { describe, expect, it } from 'vitest'

import { resolveGraphqlEndpoint } from './endpoint'

describe('resolveGraphqlEndpoint', () => {
  it('prefers the explicit GraphQL endpoint', () => {
    expect(
      resolveGraphqlEndpoint({
        apiBaseUrl: 'https://api.example.com',
        graphqlEndpoint: ' https://graphql.example.com/query ',
      }),
    ).toBe('https://graphql.example.com/query')
  })

  it('builds the endpoint from the API base URL without duplicate slashes', () => {
    expect(resolveGraphqlEndpoint({ apiBaseUrl: 'https://api.example.com///' })).toBe('https://api.example.com/graphql')
  })

  it('fails fast when neither endpoint is configured', () => {
    expect(() => resolveGraphqlEndpoint({})).toThrowError('GraphQL endpoint is not configured')
  })
})

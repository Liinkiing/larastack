import { gql } from '@apollo/client'
import { afterEach, expect, test, vi } from 'vitest'

import { onAuthSessionInvalidated } from '~/services/auth-session'

vi.mock('expo-secure-store', () => ({ setItemAsync: vi.fn(), deleteItemAsync: vi.fn() }))
vi.mock('~/utils/device', () => ({ getDeviceName: vi.fn() }))

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

test('only invalidates the session whose token received an unauthorized response', async () => {
  const response = Promise.withResolvers<Response>()
  const unauthorized = () => new Response('{}', { status: 401, headers: { 'Content-Type': 'application/json' } })
  const fetch = vi
    .fn()
    .mockReturnValueOnce(response.promise)
    .mockImplementation(async () => unauthorized())
  vi.stubGlobal('fetch', fetch)
  vi.stubEnv('EXPO_PUBLIC_API_URL', 'https://example.com')

  const { apolloClient } = await import('./client')
  const { getPersistedAccessToken, persistAccessToken } = await import('~/services/auth')
  const invalidated = vi.fn()
  const unsubscribe = onAuthSessionInvalidated(invalidated)
  const query = gql`
    query SessionStatus {
      __typename
    }
  `

  try {
    await persistAccessToken('old-token')
    const request = apolloClient.query({ query, fetchPolicy: 'no-cache' })
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledOnce())
    await persistAccessToken('current-token')

    response.resolve(unauthorized())
    await expect(request).rejects.toMatchObject({ statusCode: 401 })
    await expect(getPersistedAccessToken()).resolves.toBe('current-token')
    expect(invalidated).not.toHaveBeenCalled()

    await expect(apolloClient.query({ query, fetchPolicy: 'no-cache' })).rejects.toMatchObject({ statusCode: 401 })
    await expect(getPersistedAccessToken()).resolves.toBeNull()
    expect(invalidated).toHaveBeenCalledOnce()
  } finally {
    unsubscribe()
  }
})

import { act, renderHook, waitFor } from '@testing-library/react-native'
import { AppState } from 'react-native'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { apolloClient } from '~/apollo/client'
import {
  clearAccessToken,
  exchangeGoogleIdToken,
  fetchCurrentUser,
  getPersistedAccessToken,
  InvalidAccessTokenError,
  type MobileAuthUser,
  persistAccessToken,
} from '~/services/auth'

import { OAuthProvider, useOAuth } from './OAuthProvider'

vi.mock('~/apollo/client', () => ({ apolloClient: { clearStore: vi.fn() } }))
vi.mock('~/services/apple-signin', () => ({ isAppleSignInAvailable: vi.fn().mockResolvedValue(false) }))
vi.mock('~/services/google-signin', () => ({ signInWithGoogle: vi.fn().mockResolvedValue('google-id-token') }))
vi.mock('~/services/auth', () => ({
  clearAccessToken: vi.fn(),
  exchangeGoogleIdToken: vi.fn(),
  fetchCurrentUser: vi.fn(),
  getPersistedAccessToken: vi.fn(),
  InvalidAccessTokenError: class extends Error {},
  persistAccessToken: vi.fn(),
}))

const user: MobileAuthUser = { id: 'user-id', name: 'User', email: 'user@example.com', avatar_url: null }

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(getPersistedAccessToken).mockResolvedValue('saved-token')
  vi.mocked(fetchCurrentUser).mockResolvedValue(user)
})

afterEach(() => vi.restoreAllMocks())

test('recovers the saved session on foreground after an offline launch', async () => {
  const appState = vi.spyOn(AppState, 'addEventListener')
  vi.mocked(fetchCurrentUser).mockRejectedValueOnce(new Error('Offline'))

  const { result } = await renderHook(useOAuth, { wrapper: OAuthProvider })

  expect(result.current.isHydratingSession).toBe(false)
  expect(result.current.isAuthenticated).toBe(false)
  expect(result.current.error).toMatch(/check your connection/i)
  expect(clearAccessToken).not.toHaveBeenCalled()

  const onAppStateChange = appState.mock.calls[0][1]
  await act(async () => {
    onAppStateChange('active')
    onAppStateChange('active')
  })

  expect(fetchCurrentUser).toHaveBeenCalledTimes(2)
  expect(result.current.isAuthenticated).toBe(true)
  expect(result.current.error).toBeNull()
})

test('clears an expired saved token and stops retrying it', async () => {
  const appState = vi.spyOn(AppState, 'addEventListener')
  vi.mocked(fetchCurrentUser).mockRejectedValueOnce(new InvalidAccessTokenError())

  const { result } = await renderHook(useOAuth, { wrapper: OAuthProvider })
  await act(async () => appState.mock.calls[0][1]('active'))

  expect(clearAccessToken).toHaveBeenCalledOnce()
  expect(fetchCurrentUser).toHaveBeenCalledOnce()
  expect(result.current.isAuthenticated).toBe(false)
  expect(result.current.error).toMatch(/session expired/i)
})

test('ignores an expired restore response after a new sign-in', async () => {
  const restore = Promise.withResolvers<MobileAuthUser>()
  vi.mocked(fetchCurrentUser).mockReturnValueOnce(restore.promise)
  vi.mocked(exchangeGoogleIdToken).mockResolvedValueOnce({ token: 'replacement-token', token_type: 'Bearer', user })

  const { result } = await renderHook(useOAuth, { wrapper: OAuthProvider })
  await waitFor(() => expect(fetchCurrentUser).toHaveBeenCalledWith('saved-token'))
  await act(async () => result.current.loginWithGoogle())
  await act(async () => restore.reject(new InvalidAccessTokenError()))

  expect(apolloClient.clearStore).toHaveBeenCalledBefore(vi.mocked(persistAccessToken))
  expect(persistAccessToken).toHaveBeenCalledWith('replacement-token')
  expect(clearAccessToken).not.toHaveBeenCalled()
  expect(result.current.isAuthenticated).toBe(true)
  expect(result.current.error).toBeNull()
})

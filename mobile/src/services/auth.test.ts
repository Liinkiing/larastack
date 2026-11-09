import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store'
import { beforeEach, expect, test, vi } from 'vitest'

vi.mock('expo-secure-store', () => ({ getItemAsync: vi.fn(), setItemAsync: vi.fn(), deleteItemAsync: vi.fn() }))
vi.mock('~/utils/device', () => ({ getDeviceName: vi.fn() }))

beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
})

test('ignores a SecureStore read that resolves after the token is cleared', async () => {
  const storedToken = Promise.withResolvers<string | null>()
  vi.mocked(getItemAsync).mockReturnValueOnce(storedToken.promise)
  const { clearAccessToken, getPersistedAccessToken } = await import('./auth')

  const read = getPersistedAccessToken()
  await clearAccessToken()
  storedToken.resolve('old-token')

  await expect(read).resolves.toBeNull()
  await expect(getPersistedAccessToken()).resolves.toBeNull()
})

test('waits for a pending token deletion before writing a replacement token', async () => {
  const deletion = Promise.withResolvers<void>()
  vi.mocked(deleteItemAsync).mockReturnValueOnce(deletion.promise)
  const { clearAccessToken, getPersistedAccessToken, persistAccessToken } = await import('./auth')

  const clearing = clearAccessToken()
  const persisting = persistAccessToken('new-token')
  await vi.waitFor(() => expect(deleteItemAsync).toHaveBeenCalledOnce())
  expect(setItemAsync).not.toHaveBeenCalled()

  deletion.resolve()
  await Promise.all([clearing, persisting])

  expect(setItemAsync).toHaveBeenCalledWith('larastack.mobile.access-token', 'new-token')
  await expect(getPersistedAccessToken()).resolves.toBe('new-token')
})

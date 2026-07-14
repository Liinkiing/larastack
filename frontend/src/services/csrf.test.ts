import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ensureXsrfCookie, fetchWithXsrf, XSRF_TOKEN_COOKIE_NAME } from './csrf'

const { getCookie, primeCsrf } = vi.hoisted(() => ({
  getCookie: vi.fn<(name: string) => string | undefined>(),
  primeCsrf: vi.fn<() => Promise<void>>(),
}))

vi.mock('js-cookie', () => ({
  default: {
    get: getCookie,
  },
}))

vi.mock('./api', () => ({
  ApiService: {
    csrf: primeCsrf,
  },
}))

describe('ensureXsrfCookie', () => {
  beforeEach(() => {
    getCookie.mockReset()
    primeCsrf.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does not request a new cookie when one is already present', async () => {
    getCookie.mockReturnValue('token')

    await ensureXsrfCookie()

    expect(getCookie).toHaveBeenCalledWith(XSRF_TOKEN_COOKIE_NAME)
    expect(primeCsrf).not.toHaveBeenCalled()
  })

  it('deduplicates concurrent cookie requests', async () => {
    const deferredRequest = Promise.withResolvers<void>()
    primeCsrf.mockReturnValue(deferredRequest.promise)

    const firstRequest = ensureXsrfCookie()
    const secondRequest = ensureXsrfCookie()

    expect(primeCsrf).toHaveBeenCalledOnce()

    deferredRequest.resolve()
    await Promise.all([firstRequest, secondRequest])
  })

  it('refreshes the cookie and retries a GraphQL request once after a 419 response', async () => {
    getCookie.mockReturnValueOnce('stale-token').mockReturnValueOnce('stale-token').mockReturnValue('fresh-token')
    primeCsrf.mockImplementation(async () => {})
    const request = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 419 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }))

    const response = await fetchWithXsrf('/graphql', { method: 'POST' })
    const firstRequestOptions = request.mock.calls.at(0)?.[1] as RequestInit | undefined
    const secondRequestOptions = request.mock.calls.at(1)?.[1] as RequestInit | undefined

    expect(response.status).toBe(200)
    expect(primeCsrf).toHaveBeenCalledOnce()
    expect(request).toHaveBeenCalledTimes(2)
    expect(new Headers(firstRequestOptions?.headers).get('X-XSRF-TOKEN')).toBe('stale-token')
    expect(new Headers(secondRequestOptions?.headers).get('X-XSRF-TOKEN')).toBe('fresh-token')
  })
})

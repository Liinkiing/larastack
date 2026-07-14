import Cookies from 'js-cookie'

import { ApiService } from './api'

export const XSRF_TOKEN_COOKIE_NAME = 'XSRF-TOKEN'

let csrfRequest: Promise<void> | null = null

export async function ensureXsrfCookie(force = false): Promise<void> {
  if (!force && Cookies.get(XSRF_TOKEN_COOKIE_NAME)) {
    return
  }

  csrfRequest ??= ApiService.csrf().finally(() => {
    csrfRequest = null
  })

  await csrfRequest
}

const withXsrfHeader = (options?: RequestInit): Headers => {
  const headers = new Headers(options?.headers)
  const csrfToken = Cookies.get(XSRF_TOKEN_COOKIE_NAME)

  if (csrfToken) {
    headers.set('X-XSRF-TOKEN', csrfToken)
  }

  return headers
}

export const fetchWithXsrf: typeof fetch = async (input, options) => {
  const isBrowser = typeof window !== 'undefined'

  if (isBrowser) {
    await ensureXsrfCookie()
  }

  const response = await fetch(input, { ...options, headers: withXsrfHeader(options) })

  if (!isBrowser || response.status !== 419) {
    return response
  }

  await ensureXsrfCookie(true)

  return fetch(input, { ...options, headers: withXsrfHeader(options) })
}

import * as SecureStore from 'expo-secure-store'

import { getDeviceName } from '~/utils/device'

const ACCESS_TOKEN_KEY = 'larastack.mobile.access-token'
const AUTH_REQUEST_TIMEOUT_MS = 10_000
let accessTokenCache: string | null | undefined

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL

const getApiBaseUrl = (): string => {
  if (!apiBaseUrl) {
    throw new Error('EXPO_PUBLIC_API_URL is not configured for the mobile app.')
  }

  if (apiBaseUrl.endsWith('/')) {
    return `${apiBaseUrl}api/mobile`
  }

  return `${apiBaseUrl}/api/mobile`
}

const fetchAuth = async (input: string, init: RequestInit): Promise<Response> => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), AUTH_REQUEST_TIMEOUT_MS)

  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

export type MobileAuthUser = {
  id: string
  name: string
  email: string
  avatar_url: string | null
}

export type MobileOAuthAuthResponse = {
  token: string
  token_type: 'Bearer'
  user: MobileAuthUser
}

export type MobileAppleAuthPayload = {
  identityToken: string
  appleUser: string
  email: string | null
  givenName: string | null
  familyName: string | null
}

export class InvalidAccessTokenError extends Error {
  constructor() {
    super('The access token is no longer valid.')
    this.name = 'InvalidAccessTokenError'
  }
}

const exchangeMobileOAuth = async (
  path: string,
  body: Record<string, string | null>,
): Promise<MobileOAuthAuthResponse> => {
  const response = await fetchAuth(`${getApiBaseUrl()}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...body,
      device_name: getDeviceName(),
    }),
  })

  if (!response.ok) {
    throw new Error('Unable to authenticate right now.')
  }

  return (await response.json()) as MobileOAuthAuthResponse
}

export async function exchangeGoogleIdToken(idToken: string): Promise<MobileOAuthAuthResponse> {
  return exchangeMobileOAuth('/auth/google', {
    id_token: idToken,
  })
}

export async function exchangeAppleIdentityToken(payload: MobileAppleAuthPayload): Promise<MobileOAuthAuthResponse> {
  return exchangeMobileOAuth('/auth/apple', {
    identity_token: payload.identityToken,
    apple_user: payload.appleUser,
    email: payload.email,
    given_name: payload.givenName,
    family_name: payload.familyName,
  })
}

export async function persistAccessToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token)
  accessTokenCache = token
}

export async function clearAccessToken(): Promise<void> {
  accessTokenCache = null
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY)
}

export async function getPersistedAccessToken(): Promise<string | null> {
  if (accessTokenCache !== undefined) {
    return accessTokenCache
  }

  accessTokenCache = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY)

  return accessTokenCache
}

export function setCachedAccessToken(token: string | null): void {
  accessTokenCache = token
}

export async function fetchCurrentUser(token: string): Promise<MobileAuthUser> {
  const response = await fetchAuth(`${getApiBaseUrl()}/user`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status === 401 || response.status === 403) {
    throw new InvalidAccessTokenError()
  }

  if (!response.ok) {
    throw new Error('Unable to load the authenticated user.')
  }

  return (await response.json()) as MobileAuthUser
}

export async function revokeCurrentToken(token: string): Promise<void> {
  const response = await fetchAuth(`${getApiBaseUrl()}/auth/logout`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('ERR_REVOKE_TOKEN_FAILED')
  }
}

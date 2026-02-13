import * as SecureStore from 'expo-secure-store'

import { getDeviceName } from '~/utils/device'

const ACCESS_TOKEN_KEY = 'larastack.mobile.access-token'

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL

const getApiBaseUrl = (): string => {
  if (!apiBaseUrl) {
    throw new Error('EXPO_PUBLIC_API_URL is not configured for the mobile app.')
  }

  return apiBaseUrl
}

export type MobileAuthUser = {
  id: string
  name: string
  email: string
  avatar_url: string | null
  google_id: string | null
  apple_id: string | null
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

const exchangeMobileOAuth = async (
  path: string,
  body: Record<string, string | null>,
): Promise<MobileOAuthAuthResponse> => {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
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
  return exchangeMobileOAuth('/api/auth/google/mobile', {
    id_token: idToken,
  })
}

export async function exchangeAppleIdentityToken(payload: MobileAppleAuthPayload): Promise<MobileOAuthAuthResponse> {
  return exchangeMobileOAuth('/api/auth/apple/mobile', {
    identity_token: payload.identityToken,
    apple_user: payload.appleUser,
    email: payload.email,
    given_name: payload.givenName,
    family_name: payload.familyName,
  })
}

export async function persistAccessToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token)
}

export async function clearAccessToken(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY)
}

export async function getPersistedAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY)
}

export async function fetchCurrentUser(token: string): Promise<MobileAuthUser> {
  const response = await fetch(`${getApiBaseUrl()}/api/user`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Unable to load the authenticated user.')
  }

  return (await response.json()) as MobileAuthUser
}

export async function revokeCurrentToken(token: string): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/api/auth/mobile/logout`, {
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

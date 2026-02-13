import * as AppleAuthentication from 'expo-apple-authentication'

export type AppleSignInPayload = {
  identityToken: string
  appleUser: string
  email: string | null
  givenName: string | null
  familyName: string | null
}

export async function isAppleSignInAvailable(): Promise<boolean> {
  if (process.env.EXPO_OS !== 'ios') {
    return false
  }

  return AppleAuthentication.isAvailableAsync()
}

export async function signInWithApple(): Promise<AppleSignInPayload> {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  })

  if (!credential.identityToken) {
    throw new Error('Apple sign-in did not return an identity token.')
  }

  return {
    identityToken: credential.identityToken,
    appleUser: credential.user,
    email: credential.email,
    givenName: credential.fullName?.givenName ?? null,
    familyName: credential.fullName?.familyName ?? null,
  }
}

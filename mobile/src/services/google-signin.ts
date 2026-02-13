import {
  GoogleSignin,
  isCancelledResponse,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin'

let isConfigured = false

const configureGoogleSignin = () => {
  if (isConfigured) {
    return
  }

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
  if (!webClientId) {
    throw new Error('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is not configured.')
  }

  GoogleSignin.configure({
    webClientId,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  })

  isConfigured = true
}

export async function signInWithGoogle(): Promise<string> {
  configureGoogleSignin()

  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
  const response = await GoogleSignin.signIn()

  if (isCancelledResponse(response)) {
    throw new Error('Google sign-in was cancelled.')
  }

  if (!isSuccessResponse(response)) {
    throw new Error('Google sign-in failed.')
  }

  const idToken = response.data.idToken
  if (!idToken) {
    throw new Error('Google sign-in did not return an ID token.')
  }

  return idToken
}

export async function signOutFromGoogle(): Promise<void> {
  configureGoogleSignin()

  try {
    await GoogleSignin.signOut()
  } catch (error) {
    if (isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_REQUIRED) {
      return
    }

    throw error
  }
}

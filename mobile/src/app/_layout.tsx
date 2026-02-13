import 'react-native-reanimated'
import { DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'

import '../global.css'
import { AuthProvider, useAuth } from '~/providers/auth-provider'

void SplashScreen.preventAutoHideAsync()

function RootNavigator() {
  const { user, isHydratingSession } = useAuth()

  useEffect(() => {
    if (!isHydratingSession) {
      void SplashScreen.hideAsync()
    }
  }, [isHydratingSession])

  if (isHydratingSession) {
    return null
  }

  const allowAuthenticatedScreens = Boolean(user)
  const allowGuestScreens = !user

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={allowAuthenticatedScreens}>
        <Stack.Screen name="(authenticated)" />
      </Stack.Protected>

      <Stack.Protected guard={allowGuestScreens}>
        <Stack.Screen name="(guest)" />
      </Stack.Protected>

      <Stack.Screen name="(public)" />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider value={DefaultTheme}>
        <RootNavigator />
      </ThemeProvider>
    </AuthProvider>
  )
}

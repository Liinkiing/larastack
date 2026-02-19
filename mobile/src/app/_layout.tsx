import 'react-native-reanimated'
import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'

import '../global.css'
import { ApolloAppProvider } from '~/shared/providers/ApolloAppProvider'
import { OAuthProvider, useOAuth } from '~/shared/providers/OAuthProvider'

void SplashScreen.preventAutoHideAsync()

function RootNavigator() {
  const { isAuthenticated, isHydratingSession } = useOAuth()

  useEffect(() => {
    if (!isHydratingSession) {
      void SplashScreen.hideAsync()
    }
  }, [isHydratingSession])

  if (isHydratingSession) {
    return null
  }

  const allowAuthenticatedScreens = isAuthenticated
  const allowGuestScreens = !isAuthenticated

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={allowAuthenticatedScreens}>
        <Stack.Screen name="(authenticated)" />
      </Stack.Protected>

      <Stack.Protected guard={allowGuestScreens}>
        <Stack.Screen name="(guest)" />
      </Stack.Protected>
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <ApolloAppProvider>
      <OAuthProvider>
        <ThemeProvider value={DarkTheme}>
          <RootNavigator />
        </ThemeProvider>
      </OAuthProvider>
    </ApolloAppProvider>
  )
}

import { Stack } from 'expo-router'

export default function GuestLayout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: false,
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Login' }} />
    </Stack>
  )
}

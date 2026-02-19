import { Stack } from 'expo-router'

export default function GuestLayout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Login' }} />
    </Stack>
  )
}

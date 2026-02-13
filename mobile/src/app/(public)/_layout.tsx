import { Stack } from 'expo-router'

export default function PublicLayout() {
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="about" options={{ title: 'About' }} />
    </Stack>
  )
}

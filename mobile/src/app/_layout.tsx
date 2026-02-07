import 'react-native-reanimated'
import { DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { NativeTabs } from 'expo-router/unstable-native-tabs'
import { PlatformColor } from 'react-native'

import '../global.css'

export default function RootLayout() {
  const tabTint = process.env.EXPO_OS === 'ios' ? PlatformColor('systemOrange') : '#f97316'

  return (
    <ThemeProvider value={DefaultTheme}>
      <NativeTabs tintColor={tabTint} labelStyle={{ color: tabTint }} minimizeBehavior="onScrollDown">
        <NativeTabs.Trigger name="(home)">
          <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="about">
          <NativeTabs.Trigger.Icon
            sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }}
            md="person"
          />
          <NativeTabs.Trigger.Label>About</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  )
}

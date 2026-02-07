import 'react-native-reanimated'
import { DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs'
import { PlatformColor } from 'react-native'

import '../global.css'

export default function RootLayout() {
  const tabTint = process.env.EXPO_OS === 'ios' ? PlatformColor('systemOrange') : '#f97316'

  return (
    <ThemeProvider value={DefaultTheme}>
      <NativeTabs tintColor={tabTint} labelStyle={{ color: tabTint }} minimizeBehavior="onScrollDown">
        <NativeTabs.Trigger name="(home)">
          <Icon sf={{ default: 'house', selected: 'house.fill' }} />
          <Label>Home</Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="about">
          <Icon sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }} />
          <Label>About</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  )
}

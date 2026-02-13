import { NativeTabs } from 'expo-router/unstable-native-tabs'
import { PlatformColor } from 'react-native'

export default function AuthenticatedLayout() {
  const tabTint = process.env.EXPO_OS === 'ios' ? PlatformColor('systemOrange') : '#f97316'

  return (
    <NativeTabs tintColor={tabTint} labelStyle={{ color: tabTint }} minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="session">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }}
          md="person"
        />
        <NativeTabs.Trigger.Label>Session</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}

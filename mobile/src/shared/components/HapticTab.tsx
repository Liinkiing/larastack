import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'

import { PlatformPressable } from '@react-navigation/elements'
import * as Haptics from 'expo-haptics'

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={event => {
        if (process.env.EXPO_OS === 'ios') {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }

        props.onPressIn?.(event)
      }}
    />
  )
}

import * as Haptics from 'expo-haptics'
import { PlatformPressable } from 'expo-router/react-navigation'
import type { ComponentProps } from 'react'

type HapticTabProps = ComponentProps<typeof PlatformPressable>

export function HapticTab(props: HapticTabProps) {
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

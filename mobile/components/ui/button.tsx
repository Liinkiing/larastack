import type { ComponentProps } from 'react'
import type { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native'

import * as Haptics from 'expo-haptics'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { IconSymbol } from '~/components/ui/icon-symbol'

type ButtonVariant = 'sunset' | 'mint'
type ButtonIcon = ComponentProps<typeof IconSymbol>['name']

type ButtonProps = {
  label: string
  onPress?: (event: GestureResponderEvent) => void
  variant?: ButtonVariant
  icon?: ButtonIcon
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}

const palettes: Record<ButtonVariant, { background: string; border: string; glow: string; text: string }> = {
  sunset: {
    background: '#ff7f5f',
    border: '#f97316',
    glow: 'rgba(255,255,255,0.30)',
    text: '#fffaf5',
  },
  mint: {
    background: '#2ec8a0',
    border: '#14b8a6',
    glow: 'rgba(255,255,255,0.28)',
    text: '#f0fdfa',
  },
}

export function Button({ label, onPress, variant = 'sunset', icon, disabled = false, style }: ButtonProps) {
  const palette = palettes[variant]

  const handlePress = (event: GestureResponderEvent) => {
    if (disabled) {
      return
    }

    if (process.env.EXPO_OS === 'ios') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }

    onPress?.(event)
  }

  return (
    <Pressable
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
        },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View
        style={[
          styles.glow,
          {
            backgroundColor: palette.glow,
          },
        ]}
      />

      <View style={styles.content}>
        {icon ? <IconSymbol name={icon} size={16} color={palette.text} /> : null}
        <Text style={[styles.label, { color: palette.text }]} selectable>
          {label}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    position: 'relative',
    minHeight: 50,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: 16,
    boxShadow: '0 10px 20px rgba(15,23,42,0.12)',
  },
  glow: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    height: '52%',
    borderRadius: 14,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.56,
  },
})

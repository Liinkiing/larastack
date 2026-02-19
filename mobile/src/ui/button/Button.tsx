import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'

import { cva } from 'class-variance-authority'
import * as Haptics from 'expo-haptics'
import { GestureResponderEvent, Pressable, StyleProp, View, ViewStyle } from 'react-native'

import { IconSymbol } from '~/ui/icon-symbol'
import { Typography } from '~/ui/typography'
import { cn } from '~/utils/cn'

type ButtonIcon = ComponentProps<typeof IconSymbol>['name']

const buttonVariants = cva(
  'relative min-h-12 justify-center overflow-hidden rounded-button border px-4 shadow-button',
  {
    variants: {
      variant: {
        primary: 'border-primary bg-primary',
        secondary: 'border-secondary bg-secondary',
        accent: 'border-accent bg-accent',
      },
      size: {
        sm: 'min-h-10 px-3',
        md: 'min-h-12 px-4',
        lg: 'min-h-14 px-5',
      },
      disabled: {
        true: 'opacity-60',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>

const textColorByVariant: Record<ButtonVariant, string> = {
  primary: '#fffaf5',
  secondary: '#ecfeff',
  accent: '#f0f9ff',
}

const glowByVariant: Record<ButtonVariant, string> = {
  primary: 'bg-white/30',
  secondary: 'bg-white/25',
  accent: 'bg-white/25',
}

type ButtonProps = {
  children: ReactNode
  onPress?: (event: GestureResponderEvent) => void
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
  icon?: ButtonIcon
  disabled?: boolean
  className?: string
  style?: StyleProp<ViewStyle>
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  className,
  style,
}: ButtonProps) {
  const resolvedVariant = variant ?? 'primary'
  const resolvedSize = size ?? 'md'
  const iconColor = textColorByVariant[resolvedVariant]

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
      className={cn(buttonVariants({ variant: resolvedVariant, size: resolvedSize, disabled }), className)}
      style={({ pressed }) => [
        {
          borderCurve: 'continuous',
        },
        pressed && {
          transform: [{ scale: 0.985 }],
        },
        style,
      ]}
    >
      <View
        className={cn(
          'absolute top-[1px] right-[1px] left-[1px] h-[52%] rounded-[14px]',
          glowByVariant[resolvedVariant],
        )}
      />

      <View className="flex-row items-center justify-center gap-2">
        {icon ? <IconSymbol name={icon} size={16} color={iconColor} /> : null}
        <Typography variant="button" style={{ color: iconColor }} selectable>
          {children}
        </Typography>
      </View>
    </Pressable>
  )
}

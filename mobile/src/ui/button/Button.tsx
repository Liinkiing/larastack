import type { ComponentProps, ReactNode } from 'react'

import * as Haptics from 'expo-haptics'
import { useEffect } from 'react'
import { type GestureResponderEvent, Pressable, type StyleProp, View, type ViewStyle } from 'react-native'
import { createAnimatedComponent, Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import type { VariantProps } from '~/tailwind-variants'

import { cn, tv } from '~/tailwind-variants'
import { IconSymbol } from '~/ui/icon-symbol'
import { Typography } from '~/ui/typography'

type ButtonIcon = ComponentProps<typeof IconSymbol>['name']

const buttonStyles = tv({
  slots: {
    root: 'relative justify-center overflow-hidden rounded-button',
    typography: '',
  },
  variants: {
    variant: {
      primary: {
        root: 'border-primary bg-primary active:bg-primary-darkened',
      },
      secondary: {
        root: 'border-secondary bg-secondary active:bg-secondary-darkened',
      },
      accent: {
        root: 'border-accent bg-accent active:bg-accent-darkened',
      },
      destructive: {
        root: 'border-destructive bg-destructive active:bg-destructive-darkened',
      },
    },
    size: {
      sm: {
        root: 'min-h-12 px-4',
      },
      md: {
        root: 'min-h-14 px-5',
      },
      lg: {
        root: 'min-h-16 px-6',
        typography: 'text-heading',
      },
    },
    disabled: {
      true: {
        root: 'opacity-60',
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

type ButtonVariant = NonNullable<VariantProps<typeof buttonStyles>['variant']>

const AnimatedPressable = createAnimatedComponent(Pressable)

const textColorByVariant: Record<ButtonVariant, string> = {
  primary: '#221e1f',
  secondary: '#ffffff',
  accent: '#ffffff',
  destructive: '#ffffff',
}

const shadowColorByVariant: Record<ButtonVariant, string> = {
  primary: '#c4a728',
  secondary: '#1f5ea3',
  accent: '#3f8144',
  destructive: '#b12f2a',
}

type ButtonProps = VariantProps<typeof buttonStyles> & {
  children: ReactNode
  onPress?: (event: GestureResponderEvent) => void
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
  const { root, typography } = buttonStyles({ variant, size, disabled })
  const iconColor = textColorByVariant[variant]
  const shadowColor = shadowColorByVariant[variant]
  const maxShadowOffset = size === 'lg' ? 8 : 6
  const shadowOffsetY = useSharedValue(maxShadowOffset)

  useEffect(() => {
    if (disabled) {
      shadowOffsetY.value = maxShadowOffset
    }
  }, [disabled, shadowOffsetY, maxShadowOffset])

  const animatedPressStyle = useAnimatedStyle(
    () => ({
      boxShadow: `0px ${shadowOffsetY.value}px 0px ${shadowColor}`,
      transform: [
        {
          translateY: maxShadowOffset - shadowOffsetY.value,
        },
      ],
    }),
    [shadowColor],
  )

  const handlePressIn = () => {
    if (disabled) {
      return
    }

    shadowOffsetY.value = withTiming(Math.floor(maxShadowOffset / 2), {
      duration: 90,
      easing: Easing.out(Easing.quad),
    })
  }

  const handlePressOut = () => {
    shadowOffsetY.value = withTiming(maxShadowOffset, {
      duration: 140,
      easing: Easing.out(Easing.quad),
    })
  }

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
    <AnimatedPressable
      disabled={disabled}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={cn(root(), className)}
      style={[animatedPressStyle, style]}
    >
      <View className="flex-row items-center justify-center gap-2">
        {icon ? <IconSymbol name={icon} size={16} color={iconColor} /> : null}
        <Typography variant="button" className={typography()} style={{ color: iconColor }}>
          {children}
        </Typography>
      </View>
    </AnimatedPressable>
  )
}

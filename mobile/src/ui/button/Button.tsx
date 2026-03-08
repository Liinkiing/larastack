import * as Haptics from 'expo-haptics'
import type { ComponentProps, ReactNode } from 'react'
import { useEffect } from 'react'
import {
  ActivityIndicator,
  type GestureResponderEvent,
  Pressable,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native'
import { createAnimatedComponent, Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { cn, tv, type VariantProps } from '~/tailwind-variants'
import { IconSymbol } from '~/ui/icon-symbol'
import { Typography, type TypographyProps } from '~/ui/typography'

export type ButtonIcon = ComponentProps<typeof IconSymbol>['name']

const buttonStyles = tv({
  slots: {
    root: 'relative justify-center overflow-hidden rounded-button border',
    typography: '',
  },
  variants: {
    variant: {
      primary: {
        root: 'border-white/30 bg-primary active:bg-primary-darkened',
      },
      secondary: {
        root: 'border-white/20 bg-secondary active:bg-secondary-darkened',
      },
      accent: {
        root: 'border-white/20 bg-accent active:bg-accent-darkened',
      },
      destructive: {
        root: 'border-white/20 bg-destructive active:bg-destructive-darkened',
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

export type ButtonVariant = NonNullable<VariantProps<typeof buttonStyles>['variant']>
type ButtonSize = NonNullable<VariantProps<typeof buttonStyles>['size']>

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

const iconSizeByButtonSize: Record<ButtonSize, number> = {
  sm: 20,
  md: 24,
  lg: 28,
}

type NativePressableProps = Omit<
  ComponentProps<typeof Pressable>,
  'children' | 'onPress' | 'onPressIn' | 'onPressOut' | 'style' | 'className' | 'disabled'
>

export type ButtonProps = NativePressableProps &
  Pick<TypographyProps, 'numberOfLines'> &
  VariantProps<typeof buttonStyles> & {
    children?: ReactNode
    onPress?: (event: GestureResponderEvent) => void
    icon?: ButtonIcon
    iconSize?: number
    isLoading?: boolean
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
  iconSize,
  isLoading = false,
  disabled = false,
  className,
  style,
  accessibilityRole,
  numberOfLines,
  ...pressableProps
}: ButtonProps) {
  const isDisabled = disabled || isLoading
  const { root, typography } = buttonStyles({ variant, size, disabled: isDisabled })
  const iconColor = textColorByVariant[variant]
  const resolvedIconSize = iconSize ?? iconSizeByButtonSize[size]
  const hasLabel = children !== undefined && children !== null && children !== ''
  const hasLeadingVisual = isLoading || Boolean(icon)
  const shadowColor = shadowColorByVariant[variant]
  const maxShadowOffset = (() => {
    if (size === 'lg') {
      return 8
    }

    if (size === 'md') {
      return 6
    }

    return 4
  })()
  const shadowOffsetY = useSharedValue(maxShadowOffset)

  useEffect(() => {
    if (isDisabled) {
      shadowOffsetY.value = maxShadowOffset
    }
  }, [isDisabled, shadowOffsetY, maxShadowOffset])

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
    if (isDisabled) {
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
    if (isDisabled) {
      return
    }

    if (process.env.EXPO_OS === 'ios') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }

    onPress?.(event)
  }

  return (
    <AnimatedPressable
      {...pressableProps}
      accessibilityRole={accessibilityRole ?? 'button'}
      disabled={isDisabled}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={cn(root(), className)}
      style={[animatedPressStyle, style]}
    >
      <View className={cn('flex-row items-center justify-center', hasLeadingVisual && hasLabel ? 'gap-2' : undefined)}>
        {isLoading ? <ActivityIndicator size={resolvedIconSize} color={iconColor} /> : null}
        {!isLoading && icon ? <IconSymbol name={icon} size={resolvedIconSize} color={iconColor} /> : null}
        {hasLabel ? (
          <Typography
            variant="button"
            className={typography()}
            style={{ color: iconColor }}
            numberOfLines={numberOfLines}
          >
            {children}
          </Typography>
        ) : null}
      </View>
    </AnimatedPressable>
  )
}

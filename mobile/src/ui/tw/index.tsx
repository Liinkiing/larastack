import type { ComponentProps } from 'react'

import { Link as RouterLink } from 'expo-router'
import {
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  View as RNView,
} from 'react-native'
import { useCssElement, useNativeVariable } from 'react-native-css'

type LinkProps = ComponentProps<typeof RouterLink> & { className?: string }

const CssLink = (props: LinkProps) => {
  return useCssElement(RouterLink as any, props as any, { className: 'style' } as any)
}

export const Link = Object.assign(CssLink, {
  Trigger: RouterLink.Trigger,
  Menu: RouterLink.Menu,
  MenuAction: RouterLink.MenuAction,
  Preview: RouterLink.Preview,
})

const useWebVariable = (variable: string) => `var(${variable})`

export const useCSSVariable = process.env.EXPO_OS !== 'web' ? useNativeVariable : useWebVariable

export type ViewProps = ComponentProps<typeof RNView> & {
  className?: string
}

export const View = (props: ViewProps) => {
  return useCssElement(RNView as any, props as any, { className: 'style' } as any)
}

export const Text = (props: ComponentProps<typeof RNText> & { className?: string }) => {
  return useCssElement(RNText as any, props as any, { className: 'style' } as any)
}

type ScrollViewProps = ComponentProps<typeof RNScrollView> & {
  className?: string
  contentContainerClassName?: string
}

export const ScrollView = (props: ScrollViewProps) => {
  return useCssElement(
    RNScrollView as any,
    props as any,
    {
      className: 'style',
      contentContainerClassName: 'contentContainerStyle',
    } as any,
  )
}

export const Pressable = (props: ComponentProps<typeof RNPressable> & { className?: string }) => {
  return useCssElement(RNPressable as any, props as any, { className: 'style' } as any)
}

export const TextInput = (props: ComponentProps<typeof RNTextInput> & { className?: string }) => {
  return useCssElement(RNTextInput as any, props as any, { className: 'style' } as any)
}

export { Image } from './Image'

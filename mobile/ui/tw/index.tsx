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
  return useCssElement(RouterLink, props, { className: 'style' })
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
  return useCssElement(RNView, props, { className: 'style' })
}

export const Text = (props: ComponentProps<typeof RNText> & { className?: string }) => {
  return useCssElement(RNText, props, { className: 'style' })
}

type ScrollViewProps = ComponentProps<typeof RNScrollView> & {
  className?: string
  contentContainerClassName?: string
}

export const ScrollView = (props: ScrollViewProps) => {
  return useCssElement(RNScrollView, props, {
    className: 'style',
    contentContainerClassName: 'contentContainerStyle',
  })
}

export const Pressable = (props: ComponentProps<typeof RNPressable> & { className?: string }) => {
  return useCssElement(RNPressable, props, { className: 'style' })
}

export const TextInput = (props: ComponentProps<typeof RNTextInput> & { className?: string }) => {
  return useCssElement(RNTextInput, props, { className: 'style' })
}

export { Image } from './image'

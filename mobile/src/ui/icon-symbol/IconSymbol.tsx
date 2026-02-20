import type { SymbolViewProps, SymbolWeight } from 'expo-symbols'
import type { ComponentProps } from 'react'

import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { type OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native'

type SymbolName = Extract<SymbolViewProps['name'], string>
type MaterialIconName = ComponentProps<typeof MaterialIcons>['name']
type IconSymbolName = keyof typeof MAPPING

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'star.fill': 'star',
  'heart.fill': 'favorite',
  'bell.fill': 'notifications',
  'bookmark.fill': 'bookmark',
  'person.crop.circle.fill': 'account-circle',
  'camera.fill': 'photo-camera',
  'chart.bar.fill': 'bar-chart',
  'gearshape.fill': 'settings',
} as const satisfies Partial<Record<SymbolName, MaterialIconName>>

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName
  size?: number
  color: string | OpaqueColorValue
  style?: StyleProp<TextStyle>
  weight?: SymbolWeight
  type?: SymbolViewProps['type']
  scale?: SymbolViewProps['scale']
  colors?: SymbolViewProps['colors']
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />
}

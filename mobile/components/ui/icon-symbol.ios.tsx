import type { SymbolViewProps, SymbolWeight } from 'expo-symbols'
import type { StyleProp, ViewStyle } from 'react-native'

import { SymbolView } from 'expo-symbols'

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'semibold',
  type = 'hierarchical',
  scale = 'medium',
  colors,
}: {
  name: SymbolViewProps['name']
  size?: number
  color: string
  style?: StyleProp<ViewStyle>
  weight?: SymbolWeight
  type?: SymbolViewProps['type']
  scale?: SymbolViewProps['scale']
  colors?: SymbolViewProps['colors']
}) {
  return (
    <SymbolView
      type={type}
      scale={scale}
      colors={colors}
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  )
}

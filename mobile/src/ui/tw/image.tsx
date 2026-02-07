import type { ComponentProps } from 'react'

import { Image as ExpoImage } from 'expo-image'
import { useCssElement } from 'react-native-css'

export type ImageProps = ComponentProps<typeof ExpoImage> & { className?: string }

export const Image = (props: ImageProps) => {
  return useCssElement(ExpoImage, props, { className: 'style' })
}

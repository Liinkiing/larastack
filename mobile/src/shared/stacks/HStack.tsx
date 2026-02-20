import type { ComponentProps } from 'react'

import { View } from 'react-native'

import { cn } from '~/tailwind-variants'

type HStackProps = ComponentProps<typeof View>

export function HStack({ className, ...props }: HStackProps) {
  return <View className={cn('flex-row gap-2', className)} {...props} />
}

import type { ComponentProps } from 'react'

import { View } from 'react-native'

import { cn } from '~/tailwind-variants'

type VStackProps = ComponentProps<typeof View>

export function VStack({ className, ...props }: VStackProps) {
  return <View className={cn('flex-col gap-2', className)} {...props} />
}

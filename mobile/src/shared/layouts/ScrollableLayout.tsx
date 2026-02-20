import type { ComponentProps } from 'react'

import { ScrollView } from 'react-native'

import { cn } from '~/tailwind-variants'

type ScrollableLayoutProps = ComponentProps<typeof ScrollView>

export function ScrollableLayout({
  children,
  className,
  contentContainerClassName,
  keyboardShouldPersistTaps = 'handled',
  contentInsetAdjustmentBehavior = 'automatic',
  ...props
}: ScrollableLayoutProps) {
  return (
    <ScrollView
      className={cn('flex-1 bg-background', className)}
      contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      contentContainerClassName={cn('gap-4 px-5 pt-3 pb-12', contentContainerClassName)}
      {...props}
    >
      {children}
    </ScrollView>
  )
}

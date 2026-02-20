import { type ComponentProps, type ReactNode, useState } from 'react'
import { type LayoutChangeEvent, ScrollView, type StyleProp, View, type ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { cn } from '~/tailwind-variants'

type FixedLayoutProps = ComponentProps<typeof View> & {
  children: ReactNode
  footer?: ReactNode
  contentClassName?: string
  contentStyle?: StyleProp<ViewStyle>
  footerClassName?: string
  footerStyle?: StyleProp<ViewStyle>
  header?: ReactNode
  headerClassName?: string
  headerStyle?: StyleProp<ViewStyle>
  showsVerticalScrollIndicator?: boolean
}

export function FixedLayout({
  children,
  footer,
  className,
  style,
  contentClassName,
  contentStyle,
  footerClassName,
  footerStyle,
  header,
  headerClassName,
  headerStyle,
  showsVerticalScrollIndicator = false,
  ...props
}: FixedLayoutProps) {
  const insets = useSafeAreaInsets()
  const [contentHeight, setContentHeight] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const isScrollable = contentHeight > containerHeight + 1

  const handleContentLayout = (event: LayoutChangeEvent) => {
    setContainerHeight(event.nativeEvent.layout.height)
  }
  const handleContentSizeChange = (_width: number, height: number) => {
    setContentHeight(height)
  }

  return (
    <View
      className={cn('flex-1 gap-4 bg-background px-5 pb-12', className)}
      style={[{ paddingTop: insets.top }, style]}
      {...props}
    >
      {header ? (
        <View className={cn('gap-3', headerClassName)} style={headerStyle}>
          {header}
        </View>
      ) : null}
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow"
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        bounces={isScrollable}
        scrollEnabled={isScrollable}
        overScrollMode={isScrollable ? 'auto' : 'never'}
        onLayout={handleContentLayout}
        onContentSizeChange={handleContentSizeChange}
      >
        <View className={cn('flex-1', contentClassName)} style={contentStyle}>
          {children}
        </View>
      </ScrollView>
      {footer ? (
        <View className={cn('gap-3', footerClassName)} style={footerStyle}>
          {footer}
        </View>
      ) : null}
    </View>
  )
}

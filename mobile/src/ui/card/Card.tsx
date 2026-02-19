import type { ComponentProps } from 'react'
import type { VariantProps } from 'tailwind-variants'

import { createContext, useContext } from 'react'
import { View } from 'react-native'
import { cn, tv } from 'tailwind-variants'

const cardStyles = tv({
  slots: {
    root: 'rounded-panel shadow-panel rounded-card border border-card-border bg-card-background',
    header: '',
    body: '',
    footer: '',
  },
  variants: {
    spacing: {
      none: {
        header: '',
        body: '',
        footer: '',
      },
      sm: {
        header: 'px-3 pt-3',
        body: 'px-3 py-3',
        footer: 'gap-2 px-3 pt-2 pb-3',
      },
      md: {
        header: 'px-4 pt-4',
        body: 'px-4 py-4',
        footer: 'gap-4 px-4 pt-3 pb-4',
      },
      lg: {
        header: 'px-5 pt-5',
        body: 'px-5 py-5',
        footer: 'gap-5 px-5 pt-4 pb-5',
      },
    },
  },
  defaultVariants: {
    spacing: 'md',
  },
})

type CardVariants = VariantProps<typeof cardStyles>
type CardRootProps = ComponentProps<typeof View> & CardVariants
type CardSlotProps = ComponentProps<typeof View>

const CardVariantContext = createContext<CardVariants>({})

function CardRoot({ className, spacing, style, ...props }: CardRootProps) {
  const { root } = cardStyles({ spacing })

  return (
    <CardVariantContext.Provider value={{ spacing }}>
      <View
        className={cn(root(), className)}
        style={[
          {
            borderCurve: 'continuous',
          },
          style,
        ]}
        {...props}
      />
    </CardVariantContext.Provider>
  )
}

function CardHeader({ className, ...props }: CardSlotProps) {
  const { spacing } = useContext(CardVariantContext)
  const { header } = cardStyles({ spacing })

  return <View className={cn(header(), className)} {...props} />
}

function CardBody({ className, ...props }: CardSlotProps) {
  const { spacing } = useContext(CardVariantContext)
  const { body } = cardStyles({ spacing })

  return <View className={cn(body(), className)} {...props} />
}

function CardFooter({ className, ...props }: CardSlotProps) {
  const { spacing } = useContext(CardVariantContext)
  const { footer } = cardStyles({ spacing })

  return <View className={cn(footer(), className)} {...props} />
}

export const Card = Object.assign(CardRoot, {
  Root: CardRoot,
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
})

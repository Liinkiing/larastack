import { cnMerge, createTV } from 'tailwind-variants'

export type { VariantProps } from 'tailwind-variants'

const textSizeTokens = [
  'body-sm',
  'body-md',
  'body-lg',
  'heading-mobile-xs',
  'heading-mobile-sm',
  'heading-mobile-md',
  'heading-mobile-lg',
  'heading-mobile-2xl',
  'heading-desktop-xs',
  'heading-desktop-sm',
  'heading-desktop-md',
  'heading-desktop-lg',
  'heading-desktop-2xl',
] as const

const twMergeConfig = {
  theme: {
    text: [...textSizeTokens],
  },
} as const

export const tv = createTV({ twMergeConfig })

export function cn(...classes: Parameters<typeof cnMerge>) {
  return cnMerge(...classes)({ twMergeConfig })
}

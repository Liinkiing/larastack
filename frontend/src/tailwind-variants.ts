import { cnMerge, createTV } from 'tailwind-variants'

export type { VariantProps } from 'tailwind-variants'

const textSizeTokens = ['body-sm', 'body', 'body-lg', 'heading-1', 'heading-2', 'heading-3'] as const

const twMergeConfig = {
  theme: {
    text: [...textSizeTokens],
  },
} as const

export const tv = createTV({ twMergeConfig })

export function cn(...classes: Parameters<typeof cnMerge>) {
  return cnMerge(...classes)({ twMergeConfig })
}

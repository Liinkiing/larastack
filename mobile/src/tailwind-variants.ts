import { cnMerge, createTV } from 'tailwind-variants'

export type { VariantProps } from 'tailwind-variants'

const textSizeTokens = ['display', 'title', 'heading', 'subtitle', 'body', 'caption', 'button', 'metric'] as const

const twMergeConfig = {
  theme: {
    text: [...textSizeTokens],
  },
} as const

export const tv = createTV({ twMergeConfig })

export function cn(...classes: Parameters<typeof cnMerge>) {
  return cnMerge(...classes)({ twMergeConfig })
}

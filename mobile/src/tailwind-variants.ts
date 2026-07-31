import { cnMerge, createTV } from 'tailwind-variants'

export type { VariantProps } from 'tailwind-variants'

const twMergeConfig = {
  theme: {
    text: ['display', 'title', 'heading', 'subtitle', 'body', 'caption', 'button', 'metric'],
    radius: ['card', 'button'],
    shadow: ['card'],
  },
} as const

export const tv = createTV({ twMergeConfig })

export function cn(...classes: Parameters<typeof cnMerge>) {
  return cnMerge(...classes)({ twMergeConfig })
}

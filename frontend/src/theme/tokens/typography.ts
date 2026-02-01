import { defineTokens } from '@pandacss/dev'

export const fonts = defineTokens.fonts({
  body: { value: 'var(--font-body)' },
  display: { value: 'var(--font-display)' },
  mono: { value: 'var(--font-mono)' },
})

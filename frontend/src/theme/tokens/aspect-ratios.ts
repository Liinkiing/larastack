import { defineTokens } from '@pandacss/dev'

export const aspectRatios = defineTokens.borders({
  golden: { value: '1.618 / 1' },
  landscape: { value: '4 / 3' },
  portrait: { value: '3 / 4' },
  square: { value: '1 / 1' },
  ultrawide: { value: '18 / 5' },
  wide: { value: '16 / 9' },
})

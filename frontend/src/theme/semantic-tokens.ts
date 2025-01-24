import { defineSemanticTokens } from '@pandacss/dev'
import { toRem } from '@pandacss/shared'

export const semanticTokensColors = defineSemanticTokens.colors({
  text: {
    DEFAULT: {
      value: '{colors.black}',
    },
    disabled: {
      value: '{colors.black/50}',
    },
  },
})

export const semanticTokensFontSizes = defineSemanticTokens.fontSizes({
  body: {
    lg: { value: toRem('16px')! },
    md: { value: toRem('14px')! },
    sm: { value: toRem('12px')! },
  },
  heading: {
    desktop: {
      '2xl': { value: toRem('44px')! },
      lg: { value: toRem('32px')! },
      md: { value: toRem('28px')! },
      sm: { value: toRem('22px')! },
      xs: { value: toRem('18px')! },
    },
    mobile: {
      '2xl': { value: toRem('38px')! },
      lg: { value: toRem('30px')! },
      md: { value: toRem('24px')! },
      sm: { value: toRem('22px')! },
      xs: { value: toRem('18px')! },
    },
  },
})

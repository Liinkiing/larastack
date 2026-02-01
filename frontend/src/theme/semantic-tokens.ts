import { defineSemanticTokens } from '@pandacss/dev'
import { toRem } from '@pandacss/shared'

export const semanticTokensColors = defineSemanticTokens.colors({
  bg: {
    canvas: {
      value: '#FFF6F1',
    },
    surface: {
      DEFAULT: {
        value: '#FFF9F6',
      },
      muted: {
        value: '#FFE8E1',
      },
    },
  },
  border: {
    subtle: {
      value: 'rgba(27, 18, 16, 0.12)',
    },
  },
  accent: {
    solid: {
      value: '#D9232E',
    },
    soft: {
      value: '#FFD7CE',
    },
    warm: {
      value: '#FF7A59',
    },
    mint: {
      value: '#9FE3C5',
    },
  },
  text: {
    DEFAULT: {
      value: '#1B1210',
    },
    disabled: {
      value: 'rgba(27, 18, 16, 0.5)',
    },
    muted: {
      value: 'rgba(27, 18, 16, 0.72)',
    },
  },
})

export const semanticTokensFontSizes = defineSemanticTokens.fontSizes({
  body: {
    lg: { value: toRem('18px')! },
    md: { value: toRem('16px')! },
    sm: { value: toRem('14px')! },
  },
  heading: {
    desktop: {
      '2xl': { value: toRem('56px')! },
      lg: { value: toRem('42px')! },
      md: { value: toRem('34px')! },
      sm: { value: toRem('26px')! },
      xs: { value: toRem('22px')! },
    },
    mobile: {
      '2xl': { value: toRem('40px')! },
      lg: { value: toRem('32px')! },
      md: { value: toRem('26px')! },
      sm: { value: toRem('22px')! },
      xs: { value: toRem('20px')! },
    },
  },
})

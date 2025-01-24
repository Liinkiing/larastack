import { defineRecipe } from '@pandacss/dev'

export const textRecipe = defineRecipe({
  className: 'text',
  defaultVariants: {
    size: 'md',
  },
  jsx: ['Text'],
  base: {
    fontFamily: 'geistSans',
    color: 'current',
  },
  staticCss: ['*'],
  variants: {
    bold: {
      true: {
        fontWeight: 'bold',
      },
    },
    medium: {
      true: {
        fontWeight: 'medium',
      },
    },
    normal: {
      true: {
        fontWeight: 'normal',
      },
    },
    semibold: {
      true: {
        fontWeight: 'semibold',
      },
    },
    size: {
      lg: { textStyle: 'body.lg' },
      md: { textStyle: 'body.md' },
      sm: { textStyle: 'body.sm' },
      xl: { textStyle: 'body.xl' },
      xs: { textStyle: 'body.xs' },
    },
    uppercase: {
      true: {
        textTransform: 'uppercase',
      },
    },
  },
})

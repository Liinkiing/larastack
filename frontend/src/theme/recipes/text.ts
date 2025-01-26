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
    italic: {
      true: {
        fontStyle: 'italic',
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
    underline: {
      true: {
        textDecoration: 'underline',
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
    },
    uppercase: {
      true: {
        textTransform: 'uppercase',
      },
    },
  },
})

import { defineRecipe } from '@pandacss/dev'

export const headingRecipe = defineRecipe({
  className: 'heading',
  defaultVariants: {
    size: 'h2',
  },
  staticCss: ['*'],
  jsx: ['Heading'],
  base: {
    fontFamily: 'geistMono',
    color: 'current',
  },
  variants: {
    italic: {
      true: {
        fontStyle: 'italic',
      },
    },
    underline: {
      true: {
        textDecoration: 'underline',
      },
    },
    size: {
      h1: { textStyle: 'heading.h1' },
      h2: { textStyle: 'heading.h2' },
      h3: { textStyle: 'heading.h3' },
      h4: { textStyle: 'heading.h4' },
      h5: { textStyle: 'heading.h5' },
      h6: { textStyle: 'heading.h6' },
    },
  },
})

import { defineRecipe } from '@pandacss/dev'

export const buttonRecipe = defineRecipe({
  jsx: ['Button'],
  className: 'button',
  description: 'The styles for the Button component',
  base: {
    _focusVisible: {
      ring: '2px solid {colors.gray.500}',
      ringOffset: 1,
    },
    display: 'flex',
    fontFamily: 'geistSans',
    color: 'white',
    background: 'black',
    textBox: 'trim-both cap alphabetic',
    _hover: {
      cursor: 'pointer',
    },
  },
  variants: {
    size: {
      sm: { padding: 2, fontSize: 'body.sm', borderRadius: 'lg' },
      md: { padding: 3, fontSize: 'body.md', borderRadius: '2xl' },
      lg: { padding: 4, fontSize: 'body.lg', borderRadius: 'xl' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

import { defineRecipe } from '@pandacss/dev'

export const buttonRecipe = defineRecipe({
  jsx: ['Button'],
  className: 'button',
  description: 'The styles for the Button component',
  base: {
    display: 'flex',
    _hover: {
      cursor: 'pointer',
    },
  },
  variants: {
    variant: {
      funky: { bg: 'red.200', color: 'white' },
      edgy: { border: '1px solid {colors.red.200}' },
    },
    size: {
      sm: { padding: '4', fontSize: '12px' },
      lg: { padding: '8', fontSize: '40px' },
    },
    shape: {
      square: { borderRadius: '0' },
      circle: { borderRadius: 'full' },
    },
  },
  defaultVariants: {
    variant: 'funky',
    size: 'sm',
    shape: 'circle',
  },
})

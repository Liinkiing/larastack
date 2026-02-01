import { defineRecipe } from '@pandacss/dev'

export const buttonRecipe = defineRecipe({
  jsx: ['Button'],
  className: 'button',
  description: 'The styles for the Button component',
  base: {
    _focusVisible: {
      ring: '2px solid {colors.accent.solid/50}',
      ringOffset: 1,
    },
    alignItems: 'center',
    borderRadius: 'full',
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'body',
    fontWeight: '600',
    gap: 2,
    justifyContent: 'center',
    lineHeight: '1',
    textBox: 'trim-both cap alphabetic',
    transitionDuration: '200ms',
    transitionProperty: 'transform, box-shadow, background, color, border-color',
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    _hover: {
      transform: 'translateY(-1px)',
    },
    _active: {
      transform: 'translateY(0)',
    },
  },
  variants: {
    variant: {
      solid: {
        backgroundColor: 'accent.solid',
        color: 'bg.canvas',
        _hover: {
          backgroundColor: 'accent.warm',
        },
      },
      soft: {
        backgroundColor: 'accent.soft',
        color: 'text',
        _hover: {
          backgroundColor: 'bg.surface.muted',
        },
      },
      outline: {
        backgroundColor: 'transparent',
        border: '1px solid {colors.border.subtle}',
        color: 'text',
        _hover: {
          borderColor: 'accent.solid',
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'text',
        _hover: {
          backgroundColor: 'bg.surface.muted',
        },
      },
    },
    size: {
      sm: { paddingX: 3, paddingY: 2, fontSize: 'body.sm' },
      md: { paddingX: 4, paddingY: 3, fontSize: 'body.md' },
      lg: { paddingX: 5, paddingY: 4, fontSize: 'body.lg' },
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
})

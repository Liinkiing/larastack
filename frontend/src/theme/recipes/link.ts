import { defineRecipe } from '@pandacss/dev'
import deepmerge from 'deepmerge'

import { textRecipe } from '~/theme/recipes/text'

export const linkRecipe = deepmerge(
  textRecipe,
  defineRecipe({
    base: {
      _focusVisible: {
        borderRadius: 'full',
        ring: '2px solid {colors.accent.solid/50}',
        ringOffset: 1,
      },
      color: 'text',
      fontWeight: '600',
      textDecoration: 'none',
      textDecorationThickness: '2px',
      textUnderlineOffset: '4px',
      transitionDuration: '200ms',
      transitionProperty: 'color, text-decoration-color, background',
      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      _disabled: {
        _hover: 'text.disabled',
        base: 'text.disabled',
      },
      _hover: {
        color: 'accent.solid',
        textDecoration: 'underline',
        textDecorationColor: '{colors.accent.solid/40}',
      },
    },
    className: 'link',
    jsx: ['Link', 'AppLink'],
  }),
)

import { defineRecipe } from '@pandacss/dev'
import deepmerge from 'deepmerge'

import { textRecipe } from '~/theme/recipes/text'

export const linkRecipe = deepmerge(
  textRecipe,
  defineRecipe({
    base: {
      _focusVisible: {
        borderRadius: 'sm',
        ring: '2px solid {colors.gray.500}',
        ringOffset: 1,
      },
      color: {
        _disabled: {
          _hover: 'text.disabled',
          base: 'text.disabled',
        },
        base: 'text',
      },
      fontWeight: 'medium',
    },
    className: 'link',
    jsx: ['Link', 'AppLink'],
  }),
)

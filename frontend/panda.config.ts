/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from '@pandacss/dev'

import { conditions } from '~/theme/conditions'
import { keyframes } from '~/theme/keyframes'
import { recipes, slotRecipes } from '~/theme/recipes'
import { semanticTokensColors, semanticTokensFontSizes } from '~/theme/semantic-tokens'
import { textStyles } from '~/theme/text-styles'
import { animations } from '~/theme/tokens/animations'
import { aspectRatios } from '~/theme/tokens/aspect-ratios'
import { durations } from '~/theme/tokens/durations'
import { easings } from '~/theme/tokens/easings'
import { fonts } from '~/theme/tokens/typography'
import { zIndex } from '~/theme/tokens/z-index'

export default defineConfig({
  conditions,
  exclude: [],
  include: ['./src/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
  jsxFramework: 'react',
  outdir: './src/styled-system',
  preflight: true,
  theme: {
    extend: {
      keyframes,
      recipes,
      semanticTokens: {
        colors: semanticTokensColors,
        fontSizes: semanticTokensFontSizes,
      },
      slotRecipes,
      textStyles,
      tokens: {
        animations,
        aspectRatios,
        durations,
        easings,
        fonts,
        zIndex,
      },
    },
  },
})

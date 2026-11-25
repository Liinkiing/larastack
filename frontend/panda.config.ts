import { defineConfig } from '@pandacss/dev'

import { animationStyles } from '~/theme/animation-styles'
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
  optimize: {
    removeUnusedKeyframes: true,
    removeUnusedTokens: true,
    // Prunes compound variants down to the extracted combinations; a recipe whose variants are
    // only ever chosen at runtime needs a `staticCss.recipes` entry to keep its compounds.
    smartCompoundVariants: true,
  },
  outdir: './src/styled-system',
  preflight: true,
  // v2 no longer injects these implicitly; without them there are no base utilities, tokens or conditions.
  presets: ['@pandacss/preset-base', '@pandacss/preset-panda'],
  theme: {
    extend: {
      animationStyles,
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

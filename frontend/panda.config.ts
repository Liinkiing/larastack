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
  lightningcss: true,
  outdir: './src/styled-system',
  preflight: true,
  plugins: [
    {
      // LightningCSS incorrectly removes `backdrop-filter` when `-webkit-backdrop-filter`
      // comes after it. This plugin reorders them so webkit comes first.
      name: 'Fix backdrop-filter order for LightningCSS',
      hooks: {
        'cssgen:done': ({ artifact, content }) => {
          if (artifact !== 'styles.css') return

          return content.replaceAll(/(-webkit-backdrop-filter)/g, 'backdrop-filter')
        },
      },
    },
  ],
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

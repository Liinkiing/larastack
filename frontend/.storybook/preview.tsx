import '../app/index.css'

import type { Preview } from '@storybook/react'
import { fonts } from '../app/fonts'

const preview: Preview = {
  decorators: [
    Story => (
      <div className={`${fonts.geistSans.variable} ${fonts.geistMono.variable}`} style={{ display: 'contents' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview

import '../app/index.css'

// @ts-ignore
import type { Preview } from '@storybook/nextjs-vite'

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
  tags: ['autodocs'],
}

export default preview

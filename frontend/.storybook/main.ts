import type { StorybookConfig } from '@storybook/react-vite'

import tsconfigPaths from 'vite-tsconfig-paths'

const config: StorybookConfig = {
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],
  docs: {
    autodocs: true,
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  viteFinal: async config => {
    config.plugins = [
      ...(config.plugins ?? []),
      tsconfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ]

    return config
  },
}

export default config

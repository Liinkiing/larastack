import type { StorybookConfig } from '@storybook/nextjs-vite'

const config: StorybookConfig = {
  addons: ['@chromatic-com/storybook', '@storybook/addon-docs'],
  core: {
    disableTelemetry: true,
  },
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  staticDirs: ['../public'],
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
}
export default config

import { createRequire } from 'node:module'
import { fileURLToPath, URL } from 'node:url'

import { reactNative } from 'vitest-native'
import { defineConfig, defineProject } from 'vitest/config'

const resolve = {
  alias: { '~': fileURLToPath(new URL('./src', import.meta.url)) },
}
const testRendererPath = createRequire(import.meta.url).resolve('test-renderer')

function nativeProject(name: 'components' | 'ios' | 'android', platform: 'ios' | 'android') {
  const shared = name === 'components'

  return defineProject({
    resolve: {
      alias: [
        { find: '~', replacement: resolve.alias['~'] },
        // React Native Testing Library and direct imports must share one renderer instance.
        { find: /^test-renderer$/, replacement: testRendererPath },
      ],
    },
    plugins: [reactNative({ engine: 'native', platform })],
    test: {
      name,
      environment: 'node',
      env: { EXPO_OS: platform },
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
      include: [shared ? 'src/**/*.{test,spec}.tsx' : 'src/**/*.native.{test,spec}.tsx'],
      exclude: ['src/app/**', ...(shared ? ['src/**/*.native.{test,spec}.tsx'] : [])],
    },
  })
}

export default defineConfig({
  test: {
    projects: [
      {
        resolve,
        test: {
          name: 'unit',
          environment: 'node',
          globals: true,
          include: ['src/**/*.{test,spec}.ts'],
          exclude: ['src/app/**'],
        },
      },
      nativeProject('components', 'ios'),
      nativeProject('ios', 'ios'),
      nativeProject('android', 'android'),
    ],
  },
})

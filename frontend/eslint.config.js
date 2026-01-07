import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { FlatCompat } from '@eslint/eslintrc'
import liinkiingConfig from '@liinkiing/eslint-config/next.js'
import sortKeysFix from 'eslint-plugin-sort-keys-fix'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
})

// Filter out configs with invalid properties for flat config
// Only keep valid flat config properties
const validFlatConfigKeys = new Set([
  'files',
  'ignores',
  'languageOptions',
  'linterOptions',
  'plugins',
  'processor',
  'rules',
  'settings',
])

const filterConfigs = configs => {
  const result = []
  for (const config of configs) {
    if (Array.isArray(config)) {
      result.push(...filterConfigs(config))
    } else if (config && typeof config === 'object') {
      const validConfig = {}
      for (const key of Object.keys(config)) {
        if (validFlatConfigKeys.has(key)) {
          validConfig[key] = config[key]
        }
      }
      if (Object.keys(validConfig).length > 0) {
        result.push(validConfig)
      }
    }
  }
  return result
}

export default [
  {
    ignores: ['src/__generated__/**'],
  },
  ...filterConfigs(liinkiingConfig),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'sort-keys-fix': sortKeysFix,
    },
    rules: {
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/no-extraneous-dependencies': 'off',
      'import/order': 'off',
      'no-restricted-syntax': 'off',
      'no-use-before-define': 'off',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      'sort-keys-fix/sort-keys-fix': 'error',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-await-expression-member': 'off',
      'unicorn/no-new-array': 'off',
      'unicorn/prefer-global-this': 'off',
    },
  },
  {
    files: ['src/theme/**/*.ts'],
    rules: {
      'sort-keys-fix/sort-keys-fix': 'off',
    },
  },
  ...compat.extends('plugin:@graphql-eslint/operations-recommended').map(config => ({
    ...config,
    files: ['**/*.graphql'],
    languageOptions: {
      ...config.languageOptions,
      parserOptions: {
        ...config.languageOptions?.parserOptions,
        operations: [
          './app/**/*.graphql',
          './app/**/*.ts',
          './app/**/*.tsx',
          './src/**/*.graphql',
          './src/**/*.ts',
          './src/**/*.tsx',
        ],
        schema: ['./client.schema.graphql', './schema.graphql'],
      },
    },
  })),
]

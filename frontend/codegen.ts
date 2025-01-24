import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  documents: [
    'src/**/*.tsx',
    'app/**/*.tsx',
    'src/**/*.ts',
    'app/**/*.ts',
    'src/**/*.graphql',
    'app/**/*.graphql',
    '!src/__generated__/gql/**/*',
  ],
  generates: {
    'src/__generated__/gql/': {
      config: {
        avoidOptionals: {
          inputValue: false,
        },
        dedupeFragments: true,
        nonOptionalTypename: true,
        scalars: {
          Date: 'string',
          DateTime: 'string',
          DateTimeUTC: 'string',
          HTML: 'string',
          HexColor: 'string',
          Time: 'string',
          URI: 'string',
        },
        useTypeImports: true,
      },
      plugins: [],
      preset: 'client',
      presetConfig: {
        fragmentMasking: { unmaskFunctionName: 'getFragmentData' },
      },
    },
    'src/__generated__/gql/apollo-helpers.ts': {
      config: {
        useTypeImports: true,
      },
      plugins: ['typescript-apollo-client-helpers'],
    },
    'src/__generated__/gql/possibleTypes.json': {
      plugins: ['fragment-matcher'],
    },
  },
  overwrite: true,
  schema: ['./client.schema.graphql', './schema.graphql'],
}

export default config

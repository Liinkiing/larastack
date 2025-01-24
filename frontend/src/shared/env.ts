export const compilerEnv = {
  __DEV__: __DEV__ === 'true',
  __PREVIEW__: __PREVIEW__ === 'true',
  __PROD__: __PROD__ === 'true',
  __USE_BACKEND_PROXY__: __USE_BACKEND_PROXY__ === 'true',
} as const

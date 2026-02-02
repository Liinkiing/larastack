export const compilerEnv = {
  __DEV__: import.meta.env.DEV,
  __PREVIEW__: import.meta.env.MODE === 'preview',
  __PROD__: import.meta.env.PROD,
  __USE_BACKEND_PROXY__: import.meta.env.VITE_USE_BACKEND_PROXY === 'true',
} as const

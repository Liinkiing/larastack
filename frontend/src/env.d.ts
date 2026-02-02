/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_API_URL: string
  readonly VITE_GRAPHQL_ENDPOINT: string
  readonly VITE_USE_BACKEND_PROXY?: string
  readonly VITE_MAINTENANCE_MODE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

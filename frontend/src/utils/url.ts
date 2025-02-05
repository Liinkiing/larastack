import { compilerEnv } from '~/shared/env'

export const generateApiUrl = (path: string): string => {
  const baseUrl = compilerEnv.__USE_BACKEND_PROXY__ ? '/api' : (process.env.NEXT_PUBLIC_API_URL ?? '/')

  if (path.startsWith('/')) {
    return `${baseUrl}${path}`
  }

  return `${baseUrl}/${path}`
}

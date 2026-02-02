import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const apiUrl = env.VITE_API_URL || env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  const maintenanceMode = env.VITE_MAINTENANCE_MODE || env.NEXT_PUBLIC_MAINTENANCE_MODE || '0'
  const vercelEnv = env.VITE_VERCEL_ENV || env.NEXT_PUBLIC_VERCEL_ENV

  const useBackendProxy =
    (env.VITE_USE_BACKEND_PROXY ?? env.NEXT_PUBLIC_USE_BACKEND_PROXY) !== undefined &&
    (env.VITE_USE_BACKEND_PROXY ?? env.NEXT_PUBLIC_USE_BACKEND_PROXY) === 'true'

  const host = new URL(apiUrl).host

  // https://securityheaders.com
  const contentSecurityPolicy = `
    default-src 'self';
    script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' cdn.jsdelivr.net unpkg.com ${host};
    style-src-elem 'self' 'unsafe-inline' cdn.jsdelivr.net unpkg.com fonts.googleapis.com ${host};
    script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.jsdelivr.net *.youtube.com *.twitter.com cdn.usefathom.com;
    child-src *.youtube.com *.google.com *.twitter.com;
    style-src 'self' 'unsafe-inline' *.googleapis.com;
    img-src * blob: data:;
    media-src 'none';
    connect-src *;
    font-src 'self' data: fonts.gstatic.com;
  `

  const securityHeaders = {
    'Content-Security-Policy': contentSecurityPolicy.replaceAll('\n', ''),
    'Referrer-Policy': 'origin-when-cross-origin',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  }

  return {
    define: {
      __DEV__: JSON.stringify(mode === 'development'),
      __PREVIEW__: JSON.stringify(vercelEnv === 'preview'),
      __PROD__: JSON.stringify(mode === 'production'),
      __USE_BACKEND_PROXY__: JSON.stringify(useBackendProxy),
    },
    plugins: [
      tsconfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tanstackStart({
        spa: {
          enabled: true,
        },
      }),
      react(),
    ],
    server: {
      headers: securityHeaders,
      port: 3000,
      proxy:
        maintenanceMode === '1' || !useBackendProxy
          ? undefined
          : {
              '/api': {
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, ''),
                secure: false,
                target: apiUrl,
              },
            },
    },
    preview: {
      headers: securityHeaders,
    },
  }
})

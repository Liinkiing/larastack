import type { NextConfig } from 'next'

const {
  NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_USE_BACKEND_PROXY,
  NEXT_PUBLIC_MAINTENANCE_MODE,
  NODE_ENV,
  NEXT_PUBLIC_VERCEL_ENV,
} = process.env

const USE_BACKEND_PROXY = NEXT_PUBLIC_USE_BACKEND_PROXY !== undefined && NEXT_PUBLIC_USE_BACKEND_PROXY === 'true'

const HOST = new URL(NEXT_PUBLIC_API_URL ?? 'http://localhost:8000').host

// https://securityheaders.com
const ContentSecurityPolicy = `
  default-src 'self';
  script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' cdn.jsdelivr.net unpkg.com ${HOST};
  style-src-elem 'self' 'unsafe-inline' cdn.jsdelivr.net unpkg.com fonts.googleapis.com ${HOST};
  script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.jsdelivr.net *.youtube.com *.twitter.com cdn.usefathom.com;
  child-src *.youtube.com *.google.com *.twitter.com;
  style-src 'self' 'unsafe-inline' *.googleapis.com;
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  font-src 'self' data: fonts.gstatic.com;
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replaceAll('\n', ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

const nextConfig: NextConfig = {
  compiler: {
    define: {
      __DEV__: JSON.stringify(NODE_ENV === 'development'),
      __PREVIEW__: JSON.stringify(NEXT_PUBLIC_VERCEL_ENV === 'preview'),
      __PROD__: JSON.stringify(NODE_ENV === 'production'),
      __USE_BACKEND_PROXY__: JSON.stringify(USE_BACKEND_PROXY),
    },
  },
  async headers() {
    return [
      {
        headers: securityHeaders,
        source: '/',
      },
      {
        headers: securityHeaders,
        source: '/:path*',
      },
    ]
  },
  onDemandEntries: {
    // Make sure entries are not getting disposed.
    maxInactiveAge: 1000 * 60 * 60,
  },

  reactCompiler: true,

  reactStrictMode: true,

  async rewrites() {
    if (NEXT_PUBLIC_MAINTENANCE_MODE === '1') return []
    if (!USE_BACKEND_PROXY) return []
    return [
      {
        destination: `${NEXT_PUBLIC_API_URL}/:path*`,
        source: '/api/:path*',
      },
      {
        destination: `${NEXT_PUBLIC_API_URL}/:path*/`,
        source: '/api/:path*/',
      },
    ]
  },
}

export default nextConfig

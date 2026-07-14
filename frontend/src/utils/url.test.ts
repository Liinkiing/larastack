import { describe, expect, it } from 'vitest'

import { resolveSafeReturnPath } from './url'

const ORIGIN = 'https://app.example.com'
const FALLBACK = '/dashboard'

describe('resolveSafeReturnPath', () => {
  it('preserves same-origin paths, query strings, and fragments', () => {
    expect(resolveSafeReturnPath('/dashboard?tab=security#tokens', FALLBACK, ORIGIN)).toBe(
      '/dashboard?tab=security#tokens',
    )
  })

  it.each([
    null,
    undefined,
    '',
    '@evil.example/path',
    'https://evil.example/path',
    '//evil.example/path',
    String.raw`/\evil.example/path`,
    `/dashboard${'x'.repeat(2048)}`,
    '/dashboard\u0000',
  ])('falls back for an unsafe return target: %s', value => {
    expect(resolveSafeReturnPath(value, FALLBACK, ORIGIN)).toBe(FALLBACK)
  })
})

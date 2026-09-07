/// <reference types="vitest-native/rntl-matchers" />

import type { ComponentType } from 'react'
import { vi } from 'vitest'

const warn = console.warn.bind(console)
const deprecatedNativeExports =
  /^(ProgressBarAndroid|SafeAreaView|Clipboard|InteractionManager|PushNotificationIOS) has been (extracted|deprecated)/

vi.spyOn(console, 'warn').mockImplementation((...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].startsWith("[vitest-native] 'test-renderer' resolves to two different files.\n") &&
    new Error().stack?.replaceAll('\\', '/').includes('/vitest-native/dist/native/hooks.mjs:')
  ) {
    return
  }

  if (
    typeof args[0] === 'string' &&
    deprecatedNativeExports.test(args[0]) &&
    new Error().stack?.includes('virtual:rn-facade:')
  ) {
    return
  }

  warn(...args)
})

// Metro generates Uniwind styles; component tests exercise behavior, not native layout.
vi.mock('uniwind', () => ({
  withUniwind: (component: ComponentType<never>) => component,
}))

// SF Symbols render through an iOS native view outside these interaction tests.
vi.mock('expo-symbols', () => ({ SymbolView: () => null }))

// Haptics crosses the Expo native-module boundary; tests assert calls to this stub.
vi.mock('expo-haptics', () => ({
  impactAsync: vi.fn(),
  ImpactFeedbackStyle: { Light: 'light' },
}))

/// <reference types="vitest-native/rntl-matchers" />

import type { ComponentType } from 'react'
import { vi } from 'vitest'

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

import { render, screen, userEvent } from '@testing-library/react-native'
import * as Haptics from 'expo-haptics'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { Button } from './Button'

beforeEach(() => {
  vi.useFakeTimers()
  vi.mocked(Haptics.impactAsync).mockReset()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Button native feedback', () => {
  test('uses haptic feedback only on iOS', async () => {
    const user = userEvent.setup({ advanceTimers: delay => void vi.advanceTimersByTime(delay) })
    await render(<Button>Continue</Button>)

    await user.press(screen.getByRole('button', { name: 'Continue' }))

    if (process.env.EXPO_OS === 'ios') {
      expect(Haptics.impactAsync).toHaveBeenCalledOnce()
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light)
    } else {
      expect(Haptics.impactAsync).not.toHaveBeenCalled()
    }
  })
})

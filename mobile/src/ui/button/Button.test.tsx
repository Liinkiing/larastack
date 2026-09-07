import { render, screen, userEvent } from '@testing-library/react-native'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { Button } from './Button'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Button', () => {
  test('calls the action when pressed', async () => {
    const onPress = vi.fn()
    const user = userEvent.setup({ advanceTimers: delay => void vi.advanceTimersByTime(delay) })
    await render(<Button onPress={onPress}>Save changes</Button>)

    await user.press(screen.getByRole('button', { name: 'Save changes' }))

    expect(onPress).toHaveBeenCalledOnce()
  })

  test.each([{ disabled: true }, { isLoading: true }, { disabled: true, isLoading: true }])(
    'blocks presses while %j',
    async props => {
      const onPress = vi.fn()
      const user = userEvent.setup({ advanceTimers: delay => void vi.advanceTimersByTime(delay) })
      await render(
        <Button {...props} onPress={onPress}>
          Save changes
        </Button>,
      )

      const button = screen.getByRole('button', { name: 'Save changes' })
      expect(button).toBeDisabled()
      await user.press(button)
      expect(onPress).not.toHaveBeenCalled()
    },
  )
})

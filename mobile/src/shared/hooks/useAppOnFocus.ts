import { useEffect, useRef } from 'react'
import { AppState } from 'react-native'

export function useAppOnFocus(onFocus: () => void): void {
  const onFocusRef = useRef(onFocus)

  useEffect(() => {
    onFocusRef.current = onFocus
  }, [onFocus])

  useEffect(() => {
    let previousAppState = AppState.currentState

    const subscription = AppState.addEventListener('change', nextAppState => {
      const wasInBackground = previousAppState === 'background' || previousAppState === 'inactive'
      const isNowActive = nextAppState === 'active'

      previousAppState = nextAppState

      if (wasInBackground && isNowActive) {
        onFocusRef.current()
      }
    })

    return () => {
      subscription.remove()
    }
  }, [])
}

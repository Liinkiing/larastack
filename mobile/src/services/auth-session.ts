type Listener = () => void

const invalidatedListeners = new Set<Listener>()

export function onAuthSessionInvalidated(listener: Listener): () => void {
  invalidatedListeners.add(listener)

  return () => {
    invalidatedListeners.delete(listener)
  }
}

export function notifyAuthSessionInvalidated(): void {
  for (const listener of invalidatedListeners) {
    listener()
  }
}

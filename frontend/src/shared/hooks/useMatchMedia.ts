import { useEffect, useState } from 'react'

export const useMatchMedia = (query: string) => {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches)

    mediaQueryList.addEventListener('change', onChange)

    return () => mediaQueryList.removeEventListener('change', onChange)
  }, [query])

  return matches
}

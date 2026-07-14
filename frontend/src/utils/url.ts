const hasControlCharacter = (value: string): boolean =>
  [...value].some(character => {
    const codePoint = character.codePointAt(0)

    return codePoint !== undefined && (codePoint <= 31 || codePoint === 127)
  })

export const resolveSafeReturnPath = (value: string | null | undefined, fallback: string, origin: string): string => {
  if (
    !value ||
    value.length > 2048 ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\') ||
    hasControlCharacter(value)
  ) {
    return fallback
  }

  try {
    const url = new URL(value, origin)

    return url.origin === origin ? `${url.pathname}${url.search}${url.hash}` : fallback
  } catch {
    return fallback
  }
}

const BASE_FONT_SIZE = 16

// Replaces `toRem` from `@pandacss/shared`, which Panda v2 folded into its compiler and no longer publishes.
export const toRem = (value: `${number}px`): string => `${Number.parseFloat(value) / BASE_FONT_SIZE}rem`

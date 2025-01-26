import { defineAnimationStyles } from '@pandacss/dev'

export const animationStyles = defineAnimationStyles({
  'slide-fade-in': {
    value: {
      transformOrigin: 'var(--transform-origin)',
      animationDuration: 'fast',
      '&[data-placement^=top]': {
        animationName: 'slide-from-top, fade-in',
      },
      '&[data-placement^=bottom]': {
        animationName: 'slide-from-bottom, fade-in',
      },
      '&[data-placement^=left]': {
        animationName: 'slide-from-left, fade-in',
      },
      '&[data-placement^=right]': {
        animationName: 'slide-from-right, fade-in',
      },
    },
  },
})

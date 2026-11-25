import { defineKeyframes } from '@pandacss/dev'

export const keyframes = defineKeyframes({
  'fade-in': {
    from: { opacity: '0' },
    to: { opacity: '1' },
  },
  'fade-out': {
    from: { opacity: '1' },
    to: { opacity: '0' },
  },
  'slide-in': {
    '0%': { opacity: '0', transform: 'translateY(64px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  'slide-out': {
    '0%': { opacity: '1', transform: 'translateY(0)' },
    '100%': { opacity: '0', transform: 'translateY(64px)' },
  },
  'slide-in-left': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(0%)' },
  },
  'slide-out-left': {
    '0%': { transform: 'translateX(0%)' },
    '100%': { transform: 'translateX(-100%)' },
  },
  'slide-in-right': {
    '0%': { transform: 'translateX(100%)' },
    '100%': { transform: 'translateX(0%)' },
  },
  'slide-out-right': {
    '0%': { transform: 'translateX(0%)' },
    '100%': { transform: 'translateX(100%)' },
  },
  // Placement-based entry for overlays, composed with `fade-in` by the `slide-fade-in` animation
  // style. Each one starts offset on the side it is named after and settles toward the trigger, so
  // they only touch `transform` and leave opacity to `fade-in`.
  'slide-from-top': {
    '0%': { transform: 'translateY(-8px)' },
    '100%': { transform: 'translateY(0)' },
  },
  'slide-from-bottom': {
    '0%': { transform: 'translateY(8px)' },
    '100%': { transform: 'translateY(0)' },
  },
  'slide-from-left': {
    '0%': { transform: 'translateX(-8px)' },
    '100%': { transform: 'translateX(0)' },
  },
  'slide-from-right': {
    '0%': { transform: 'translateX(8px)' },
    '100%': { transform: 'translateX(0)' },
  },
  'collapse-in': {
    '0%': { height: '0' },
    '100%': { height: 'var(--height)' },
  },
  'collapse-out': {
    '0%': { height: 'var(--height)' },
    '100%': { height: '0' },
  },
  fadeIn: {
    '0%': { opacity: '0', transform: 'translateY(-4px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  fadeOut: {
    '0%': { opacity: '1', transform: 'translateY(0)' },
    '100%': { opacity: '0', transform: 'translateY(-4px)' },
  },
  'skeleton-pulse': {
    '50%': { opacity: '0.5' },
  },
  spin: {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
})

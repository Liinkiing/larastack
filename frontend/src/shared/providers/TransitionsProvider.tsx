'use client'

import type { FC, ReactNode } from 'react'

import { animate, useReducedMotion } from 'motion/react'
import { TransitionRouter } from 'next-transition-router'
import { useCallback, useRef } from 'react'

interface Props {
  children: ReactNode
}

export const TransitionsProvider: FC<Props> = ({ children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null!)
  const shouldReduceMotion = useReducedMotion()

  const runOpacityTransition = useCallback(
    (opacity: [number, number], ease: 'easeIn' | 'easeOut', next: () => void) => {
      if (shouldReduceMotion || !wrapperRef.current) {
        next()
        return
      }

      animate(wrapperRef.current, { opacity }, { duration: 0.15, ease, onComplete: next })
    },
    [shouldReduceMotion],
  )

  return (
    <TransitionRouter
      auto
      enter={(next: () => void) => {
        runOpacityTransition([0, 1], 'easeIn', next)
      }}
      leave={(next: () => void) => {
        runOpacityTransition([1, 0], 'easeOut', next)
      }}
    >
      <div ref={wrapperRef}>{children}</div>
    </TransitionRouter>
  )
}

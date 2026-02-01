'use client'

import type { FC, ReactNode } from 'react'

import { animate } from 'motion/react'
import { TransitionRouter } from 'next-transition-router'
import { useRef } from 'react'

interface Props {
  children: ReactNode
}

export const TransitionsProvider: FC<Props> = ({ children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null!)

  return (
    <TransitionRouter
      auto
      enter={next => {
        animate(wrapperRef.current, { opacity: [0, 1] }, { duration: 0.15, ease: 'easeIn', onComplete: next })
      }}
      leave={next => {
        animate(wrapperRef.current, { opacity: [1, 0] }, { duration: 0.15, ease: 'easeOut', onComplete: next })
      }}
    >
      <div ref={wrapperRef}>{children}</div>
    </TransitionRouter>
  )
}

'use client'

import type { FC, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export const TransitionsProvider: FC<Props> = ({ children }) => {
  return children
}

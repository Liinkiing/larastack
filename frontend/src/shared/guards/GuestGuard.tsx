'use client'

import type { FC, ReactNode } from 'react'

import { useAuth } from '~/shared/hooks/useAuth'

interface Props {
  fallback: ReactNode
  children: ReactNode
}

export const GuestGard: FC<Props> = ({ children, fallback }) => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return fallback
  }

  return children
}

'use client'

import type { FC } from 'react'

import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

interface Props {
  readonly to: string
  readonly mode?: 'replace' | 'push'
}

export const Redirect: FC<Props> = ({ to, mode = 'replace' }) => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate({
      replace: mode === 'replace',
      to,
    })
  }, [navigate, mode, to])

  return null
}

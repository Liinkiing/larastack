'use client'

import type { FC } from 'react'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface Props {
  readonly to: string
  readonly mode?: 'replace' | 'push'
}

export const Redirect: FC<Props> = ({ to, mode = 'replace' }) => {
  const router = useRouter()

  useEffect(() => {
    if (mode === 'replace') {
      router.replace(to)
    } else if (mode === 'push') {
      router.push(to)
    } else {
      throw new Error(`Unknown mode given for <Redirect />: ${mode}`)
    }
  }, [router, mode, to])

  return null
}

'use client'

import { AxiosError } from 'axios'
import type { FC, ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { ApiService } from '~/services/api'
import { AuthService } from '~/services/auth'
import { GlobalLoader } from '~/shared/components/GlobalLoader'
import { GenericErrorLayout } from '~/shared/layouts/GenericErrorLayout'

interface Props {
  children: ReactNode
}

export const CsrfProvider: FC<Props> = ({ children }) => {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<AxiosError | null>(null)

  useEffect(() => {
    const doFetchCsrf = async () => {
      try {
        await ApiService.csrf()
        setReady(true)
      } catch (error_) {
        if (error_ instanceof AxiosError) {
          if (error_.response?.status === 401) {
            await AuthService.logout()
          } else {
            setError(error_)
          }
        }
      }
    }
    doFetchCsrf()
  }, [])

  if (error) {
    return <GenericErrorLayout />
  }

  if (!ready) {
    return <GlobalLoader />
  }

  return children
}

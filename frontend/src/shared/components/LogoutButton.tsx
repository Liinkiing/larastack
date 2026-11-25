'use client'

import type { FC, ReactNode } from 'react'
import { useState } from 'react'

import type { ButtonProps } from '~/ui/button'
import { Button } from '~/ui/button'

import { useAuth } from '../hooks'

interface Props extends ButtonProps {
  children?: ReactNode
}

export const LogoutButton: FC<Props> = ({ children, disabled, onClick, ...props }) => {
  const { logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const signOut = async () => {
    setIsLoggingOut(true)

    try {
      await logout()
    } catch {
      window.alert('Unable to sign out right now. Please retry.')
      setIsLoggingOut(false)
    }
  }

  return (
    <Button
      {...props}
      aria-busy={isLoggingOut}
      disabled={disabled || isLoggingOut}
      onClick={event => {
        onClick?.(event)
        if (event.defaultPrevented) {
          return
        }

        void signOut()
      }}
    >
      {isLoggingOut ? 'Signing out…' : (children ?? 'Logout')}
    </Button>
  )
}

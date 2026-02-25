'use client'

import type { FC, ReactNode } from 'react'

import type { ButtonProps } from '~/ui/button'
import { Button } from '~/ui/button'

import { useAuth } from '../hooks'

interface Props extends ButtonProps {
  children?: ReactNode
}

export const LogoutButton: FC<Props> = ({ children, onClick, ...props }) => {
  const { logout } = useAuth()

  return (
    <Button
      onClick={e => {
        onClick?.(e)
        logout()
      }}
      {...props}
    >
      {children ?? 'Logout'}
    </Button>
  )
}

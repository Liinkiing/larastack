'use client'

import { usePathname } from 'next/navigation'
import type { FC } from 'react'

import type { AppLinkProps } from '~/shared/components/AppLink'
import { AppLink } from '~/shared/components/AppLink'

interface Props extends AppLinkProps {
  disabled?: boolean
  isActiveForRoutes?: string[]
}

export const AppNavigationItem: FC<Props> = ({ children, isActiveForRoutes = [], disabled, href, ...props }) => {
  const pathname = usePathname()
  const computedHref = typeof href === 'object' ? href.href : href
  const isActive = pathname === computedHref || isActiveForRoutes.includes(pathname)
  const currentPageProps = isActive ? ({ 'aria-current': 'page' } as const) : {}

  return (
    <AppLink
      {...currentPageProps}
      _currentPage={{
        bg: 'gray.200',
      }}
      _disabled={{
        opacity: 0.5,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
      bg={{ _hover: 'gray.300' }}
      borderRadius="2xl"
      cursor="pointer"
      gap={2}
      px={2}
      py={3}
      {...(disabled ? { 'data-disabled': true } : {})}
      href={href}
      {...props}
    >
      {children}
    </AppLink>
  )
}

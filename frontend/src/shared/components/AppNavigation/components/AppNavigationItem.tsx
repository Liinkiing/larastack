'use client'

import { usePathname } from 'next/navigation'
import type { FC } from 'react'

import type { AppLinkProps } from '~/shared/components/AppLink'
import { AppLink } from '~/shared/components/AppLink'
import { cn } from '~/tailwind-variants'

interface Props extends AppLinkProps {
  disabled?: boolean
  isActiveForRoutes?: string[]
}

export const AppNavigationItem: FC<Props> = ({
  children,
  className,
  isActiveForRoutes = [],
  disabled,
  href,
  ...props
}) => {
  const pathname = usePathname()
  const computedHref = typeof href === 'object' ? href.href : href
  const isActive = pathname === computedHref || isActiveForRoutes.includes(pathname)
  const currentPageProps = isActive ? ({ 'aria-current': 'page' } as const) : {}

  return (
    <AppLink
      {...currentPageProps}
      aria-disabled={disabled || undefined}
      className={cn(
        'rounded-full bg-transparent px-3 py-2 whitespace-nowrap hover:bg-muted hover:text-foreground hover:no-underline',
        'aria-[current=page]:bg-primary-soft aria-[current=page]:font-bold aria-[current=page]:text-foreground',
        className,
      )}
      href={href}
      {...props}
    >
      {children}
    </AppLink>
  )
}

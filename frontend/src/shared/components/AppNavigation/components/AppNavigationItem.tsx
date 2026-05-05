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
      className={cn(
        'inline-flex cursor-pointer items-center gap-2 rounded-full bg-transparent px-3 py-2 hover:bg-surface-muted',
        'aria-[current=page]:bg-accent-soft aria-[current=page]:font-bold aria-[current=page]:text-text',
        'data-disabled:pointer-events-none data-disabled:opacity-50 data-disabled:select-none',
        className,
      )}
      {...(disabled ? { 'data-disabled': true } : {})}
      href={href}
      {...props}
    >
      {children}
    </AppLink>
  )
}

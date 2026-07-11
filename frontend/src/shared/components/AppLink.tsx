'use client'

import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { ComponentProps } from 'react'

import type { VariantProps } from '~/tailwind-variants'
import { cn } from '~/tailwind-variants'
import { linkVariants } from '~/ui/link'

export type AppLinkProps = Omit<ComponentProps<typeof NextLink>, 'className'> &
  VariantProps<typeof linkVariants> & {
    className?: string
    keepSearchParams?: boolean
  }

export function AppLink({
  href: userHref,
  as,
  replace,
  scroll,
  shallow,
  passHref,
  prefetch = true,
  locale,
  legacyBehavior,
  onMouseEnter,
  onTouchStart,
  onClick,
  keepSearchParams,
  className,
  size,
  onNavigate,
  ...props
}: AppLinkProps) {
  const params = useSearchParams()

  let href = userHref
  if (keepSearchParams && href && typeof href === 'string') {
    href = href.includes('?') ? `${href}&${params.toString()}` : `${href}?${params.toString()}`
  }

  return (
    <NextLink
      as={as}
      className={cn(linkVariants({ size }), className)}
      data-slot="app-link"
      href={href}
      legacyBehavior={legacyBehavior}
      locale={locale}
      passHref={passHref}
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onNavigate={onNavigate}
      onTouchStart={onTouchStart}
      {...props}
    />
  )
}

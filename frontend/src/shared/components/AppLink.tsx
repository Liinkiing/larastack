'use client'

import type { LinkProps as NextLinkProps } from 'next/link'
import type { FC } from 'react'

import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'

import type { LinkProps } from '~/ui/link'

import { Link } from '~/ui/link'

export type AppLinkProps = Omit<LinkProps, keyof NextLinkProps> &
  NextLinkProps & {
    keepSearchParams?: boolean
  }

export const AppLink: FC<AppLinkProps> = ({
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
  children,
  _hover,

  onNavigate,
  ...props
}) => {
  const params = useSearchParams()

  let href = userHref
  if (keepSearchParams && href && typeof href === 'string') {
    href = href.includes('?') ? `${href}&${params.toString()}` : `${href}?${params.toString()}`
  }

  return (
    <Link
      asChild
      _hover={{
        color: 'initial',
        ..._hover,
      }}
      {...props}
    >
      <NextLink
        as={as}
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
      >
        {children}
      </NextLink>
    </Link>
  )
}

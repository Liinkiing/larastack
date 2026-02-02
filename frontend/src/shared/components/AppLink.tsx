'use client'

import type { FC } from 'react'

import { Link as RouterLink } from '@tanstack/react-router'

import type { LinkProps } from '~/ui/link'

import { Link } from '~/ui/link'

export type AppLinkProps = LinkProps & {
  href: string
  keepSearchParams?: boolean
}

export const AppLink: FC<AppLinkProps> = ({ href: userHref, keepSearchParams, children, _hover, ...props }) => {
  let href = userHref
  if (keepSearchParams && typeof window !== 'undefined') {
    const search = window.location.search
    if (search) {
      href = href.includes('?') ? `${href}&${search.slice(1)}` : `${href}${search}`
    }
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
      <RouterLink to={href}>{children}</RouterLink>
    </Link>
  )
}

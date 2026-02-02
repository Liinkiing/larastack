import type { FC } from 'react'

import { Link as RouterLink } from '@tanstack/react-router'

import type { LinkProps } from '~/ui/link'

import { AppHref } from '~/@types/routes'
import { Link } from '~/ui/link'

export type AppLinkProps = LinkProps & {
  href: AppHref
  keepSearchParams?: boolean
}

export const AppLink: FC<AppLinkProps> = ({ href: userHref, keepSearchParams, children, _hover, ...props }) => {
  let href = userHref as string
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

'use client'

import type { LinkProps as NextLinkProps } from 'next/link'
import NextLink from 'next/link'
import type { FC } from 'react'

import type { LinkProps } from '~/ui/link'
import { Link } from '~/ui/link'

export type AppLinkProps = Omit<LinkProps, keyof NextLinkProps> & NextLinkProps

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
  children,
  _hover,

  onNavigate,
  ...props
}) => {
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
        href={userHref}
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

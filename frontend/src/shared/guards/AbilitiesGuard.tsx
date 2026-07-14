'use client'

import type { FC, ReactNode } from 'react'

import type { ViewerQuery } from '~/__generated__/gql/graphql'
import { useViewer } from '~/shared/hooks/useAuth'

type UserAbilities = NonNullable<ViewerQuery['viewer']>['abilities']

interface Props {
  abilities: Partial<Omit<UserAbilities, '__typename'>>
  fallback: ReactNode
  children: ReactNode
}

export const AbilitiesGuard: FC<Props> = ({ abilities, children, fallback }) => {
  const viewer = useViewer()

  const keys = Object.keys(abilities) as Array<keyof typeof abilities>

  for (const ability of keys) {
    if (viewer.abilities[ability] !== abilities[ability]) {
      return fallback
    }
  }

  return children
}

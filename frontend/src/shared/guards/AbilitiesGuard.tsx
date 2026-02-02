import type { FC, ReactNode } from 'react'

import type { UserAbilities } from '~/__generated__/gql/graphql'

import { useAuth } from '~/shared/hooks/useAuth'

interface Props {
  abilities: Partial<Omit<UserAbilities, '__typename'>>
  fallback: ReactNode
  children: ReactNode
}

export const AbilitiesGuard: FC<Props> = ({ abilities, children, fallback }) => {
  const { viewer } = useAuth()

  const keys = Object.keys(abilities) as Array<keyof typeof abilities>

  for (const ability of keys) {
    if (viewer.abilities[ability] !== abilities[ability]) {
      return fallback
    }
  }

  return children
}

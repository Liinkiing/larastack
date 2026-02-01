'use client'

import type { FC, ReactNode } from 'react'

import { ApolloProvider } from '@apollo/client/react'

import { apolloClient } from '~/apollo/client'

interface Props {
  children: ReactNode
}

export const AppProviders: FC<Props> = ({ children }) => {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}

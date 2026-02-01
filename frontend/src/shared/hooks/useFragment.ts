import type { OperationVariables } from '@apollo/client/core'

import { useFragment as useApolloFragment } from '@apollo/client/react'

export const useFragment = <TData = any, TVars extends OperationVariables = OperationVariables>(
  options: Omit<useApolloFragment.Options<TData, TVars>, 'fragmentName'> & {
    fragmentName?: string
  },
): TData => {
  const { fragment, from, client, optimistic, fragmentName, variables } = options

  return useApolloFragment({
    client,
    fragment,
    fragmentName:
      fragmentName ??
      (fragment.definitions.find((def: any) => def.kind === 'FragmentDefinition') as any)?.name.value ??
      '',
    from,
    optimistic,
    variables,
  }).data as TData
}

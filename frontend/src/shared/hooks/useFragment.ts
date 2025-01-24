import { useFragment as useApolloFragment } from '@apollo/client'
import type { OperationVariables } from '@apollo/client/core'
import type { UseFragmentOptions } from '@apollo/client/react/hooks/useFragment'

export const useFragment = <TData = any, TVars = OperationVariables>(
  options: Omit<UseFragmentOptions<TData, TVars>, 'fragmentName'> & { fragmentName?: string },
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

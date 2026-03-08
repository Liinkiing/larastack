import type { TypedTypePolicies } from '~/__generated__/gql/apollo-helpers'

const ROOT_QUERY_REF = { __ref: 'ROOT_QUERY' } as const

export const User: NonNullable<TypedTypePolicies['User']> = {
  fields: {
    isViewer: {
      read(_existing, { readField }) {
        const viewerRef = readField<{ __ref: string } | null>('viewer', ROOT_QUERY_REF)
        const viewerId = viewerRef ? readField<string>('id', viewerRef) : null
        const userId = readField<string>('id')

        return Boolean(userId && viewerId && userId === viewerId)
      },
    },
    abilities: {
      merge(existing, incoming, { mergeObjects }) {
        return mergeObjects(existing, incoming)
      },
    },
  },
}

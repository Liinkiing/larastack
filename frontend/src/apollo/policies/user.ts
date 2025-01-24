import type { TypedTypePolicies } from '~/__generated__/gql/apollo-helpers'

export const User: NonNullable<TypedTypePolicies['User']> = {
  fields: {
    abilities: {
      merge(existing, incoming, { mergeObjects }) {
        return mergeObjects(existing, incoming)
      },
    },
  },
}

import type { TypedTypePolicies } from '~/__generated__/gql/apollo-helpers'
import { User } from '~/apollo/policies/user'

const typePolicies: TypedTypePolicies = {
  User,
}

export { typePolicies }

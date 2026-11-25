import type { GraphQLCodegenDataMasking } from '@apollo/client/masking'

declare module '@apollo/client' {
  interface DefaultContext {
    headers?: Record<string, string>
    authSessionToken?: string | null
  }

  // oxlint-disable-next-line typescript/no-empty-object-type -- Apollo's documented module augmentation intentionally has no members of its own.
  interface TypeOverrides extends GraphQLCodegenDataMasking.TypeOverrides {}
}

import { CombinedGraphQLErrors } from '@apollo/client/errors'
import { ErrorLink } from '@apollo/client/link/error'

import { compilerEnv } from '~/shared/env'

const INTERNAL_ERROR_FALLBACK_MESSAGE = 'There seems to be an error. Please try again later or contact support.'
const INTERNAL_ERRORS_MESSAGES = new Set(['Internal server error', 'Internal server error.'].map(v => v.toLowerCase()))

const DENIED_MESSAGE = 'Unauthenticated.'

export default new ErrorLink(({ error, forward, operation }) => {
  if (CombinedGraphQLErrors.is(error)) {
    const graphQLErrors = error.errors

    if (
      graphQLErrors
        .filter(gqlError => !gqlError.path?.includes('viewer'))
        .map(gqlError => gqlError.message)
        .join(', ')
        .includes(DENIED_MESSAGE) &&
      compilerEnv.__DEV__
    ) {
      console.warn('Tried to access to a ressource which does not seems to belong to the logged in user. Forbid it.')
    }

    if (graphQLErrors.length > 0 && graphQLErrors[0].message) {
      const gqlError = graphQLErrors[0]
      let message = 'debugMessage' in gqlError ? (gqlError as any).debugMessage : gqlError.message
      if (INTERNAL_ERRORS_MESSAGES.has(message.toLowerCase())) {
        message = INTERNAL_ERROR_FALLBACK_MESSAGE
      }

      if (
        gqlError.extensions &&
        gqlError.extensions.category === 'validation' &&
        'validation' in gqlError.extensions &&
        typeof gqlError.extensions.validation === 'object'
      ) {
        message = Object.entries(gqlError.extensions.validation as Record<string, string>)
          .flatMap(([, value]) => value)
          .map(v => v.replace('input.', ''))
          .join('\r\n')
      }

      if (
        compilerEnv.__DEV__ &&
        gqlError.extensions &&
        'debugMessage' in gqlError.extensions &&
        'trace' in gqlError.extensions
      ) {
        const relevantMessages = (gqlError.extensions as any).trace.filter(
          (t: any) => t.call && t.call.startsWith('App'),
        )
        console.error(`GraphQL Error:
${gqlError.extensions.debugMessage}
${JSON.stringify(relevantMessages, null, 2)}
`)
      } else {
        window.alert(message)
      }
    }
  }

  return forward(operation)
})

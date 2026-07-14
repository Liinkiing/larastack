import { CombinedGraphQLErrors } from '@apollo/client/errors'
import { ErrorLink } from '@apollo/client/link/error'

import { compilerEnv } from '~/shared/env'

const INTERNAL_ERROR_FALLBACK_MESSAGE = 'There seems to be an error. Please try again later or contact support.'
const INTERNAL_ERRORS_MESSAGES = new Set(['Internal server error', 'Internal server error.'].map(v => v.toLowerCase()))

const DENIED_MESSAGE = 'Unauthenticated.'

export default new ErrorLink(({ error }) => {
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
      console.warn('Tried to access a resource that does not belong to the logged-in user. The request was denied.')
    }

    if (graphQLErrors.length > 0 && graphQLErrors[0].message) {
      const gqlError = graphQLErrors[0]
      const extensions = gqlError.extensions ?? {}
      let message = gqlError.message
      if (INTERNAL_ERRORS_MESSAGES.has(message.toLowerCase())) {
        message = INTERNAL_ERROR_FALLBACK_MESSAGE
      }

      if (
        extensions.category === 'validation' &&
        typeof extensions.validation === 'object' &&
        extensions.validation !== null
      ) {
        message = Object.values(extensions.validation)
          .flatMap(value => {
            if (typeof value === 'string') {
              return [value]
            }

            return Array.isArray(value) ? value.filter(item => typeof item === 'string') : []
          })
          .map(v => v.replace('input.', ''))
          .join('\r\n')
      }

      if (compilerEnv.__DEV__ && typeof extensions.debugMessage === 'string' && Array.isArray(extensions.trace)) {
        const relevantMessages = extensions.trace.filter(traceItem => {
          if (typeof traceItem !== 'object' || traceItem === null || !('call' in traceItem)) {
            return false
          }

          return typeof traceItem.call === 'string' && traceItem.call.startsWith('App')
        })
        console.error(`GraphQL Error:
${extensions.debugMessage}
${JSON.stringify(relevantMessages, null, 2)}
`)
      } else if (typeof window !== 'undefined') {
        window.alert(message)
      }
    }
  }
})

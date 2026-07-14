type GraphqlEndpointOptions = {
  apiBaseUrl?: string
  graphqlEndpoint?: string
}

export function resolveGraphqlEndpoint({ apiBaseUrl, graphqlEndpoint }: GraphqlEndpointOptions): string {
  const explicitEndpoint = graphqlEndpoint?.trim()
  if (explicitEndpoint) {
    return explicitEndpoint
  }

  const normalizedApiBaseUrl = apiBaseUrl?.trim().replace(/\/+$/, '')
  if (normalizedApiBaseUrl) {
    return `${normalizedApiBaseUrl}/graphql`
  }

  throw new Error('GraphQL endpoint is not configured. Set EXPO_PUBLIC_API_URL or EXPO_PUBLIC_GRAPHQL_ENDPOINT.')
}

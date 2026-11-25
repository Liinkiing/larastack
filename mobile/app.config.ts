import type { ConfigContext, ExpoConfig } from 'expo/config'

export default ({ config }: ConfigContext): Partial<ExpoConfig> => {
  const isDevelopment = process.env.APP_VARIANT === 'development'
  const easConfig = config.extra?.eas as { projectId?: string } | undefined
  const projectId = easConfig?.projectId
  const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
  const googleIosUrlScheme = googleIosClientId?.endsWith('.apps.googleusercontent.com')
    ? googleIosClientId.split('.').reverse().join('.')
    : undefined

  return {
    ...config,
    name: isDevelopment ? `${config.name} Dev` : config.name,
    scheme: isDevelopment ? `${config.scheme}-dev` : config.scheme,
    ios: {
      ...config.ios,
      bundleIdentifier: isDevelopment ? `${config.ios?.bundleIdentifier}.dev` : config.ios?.bundleIdentifier,
    },
    android: {
      ...config.android,
      package: isDevelopment ? `${config.android?.package}.dev` : config.android?.package,
    },
    updates: {
      ...(projectId && { url: `https://u.expo.dev/${projectId}` }),
      ...config.updates,
    },
    plugins: [
      ...(config.plugins ?? []).flatMap<NonNullable<ExpoConfig['plugins']>[number]>(plugin => {
        if (!Array.isArray(plugin) || plugin[0] !== '@react-native-google-signin/google-signin') {
          return [plugin]
        }

        const options = plugin[1] as { iosUrlScheme?: string } | undefined

        if (googleIosUrlScheme) {
          return [[plugin[0], { ...options, iosUrlScheme: googleIosUrlScheme }]]
        }

        return options?.iosUrlScheme === '<YOUR_IOS_URL_SCHEME>' ? [] : [plugin]
      }),
      ['expo-dev-client', { addGeneratedScheme: isDevelopment }],
    ],
  }
}

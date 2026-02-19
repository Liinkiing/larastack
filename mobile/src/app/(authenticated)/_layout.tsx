import { NativeTabs } from 'expo-router/unstable-native-tabs'
import { PlatformColor } from 'react-native'

import { MobileAuthViewerDocument } from '~/__generated__/gql/graphql'
import { apolloClient } from '~/apollo/client'
import { useAppOnFocus } from '~/shared/hooks/useAppOnFocus'
import { useOAuth } from '~/shared/providers/OAuthProvider'
import { APP_BACKGROUND_COLOR } from '~/shared/theme/colors'

export default function AuthenticatedLayout() {
  const { isAuthenticated } = useOAuth()

  const tabTint = process.env.EXPO_OS === 'ios' ? PlatformColor('systemIndigo') : '#560591'

  useAppOnFocus(() => {
    if (!isAuthenticated) {
      return
    }

    void apolloClient.refetchQueries({
      include: [MobileAuthViewerDocument],
    })
  })

  return (
    <NativeTabs
      tintColor={tabTint}
      labelStyle={{ color: tabTint }}
      minimizeBehavior="onScrollDown"
      backgroundColor={APP_BACKGROUND_COLOR}
    >
      <NativeTabs.Trigger name="(root)">
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="session">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }}
          md="person"
        />
        <NativeTabs.Trigger.Label>Session</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}

import * as AppleAuthentication from 'expo-apple-authentication'

import { useOAuth } from '~/shared/providers/OAuthProvider'
import { Button } from '~/ui/Button'
import { Card } from '~/ui/Card'
import { ScrollView } from '~/ui/tw'
import { Typography } from '~/ui/Typography'

export default function LoginScreen() {
  const { error, isAppleLoginAvailable, isLoading, loginWithApple, loginWithGoogle, clearError } = useOAuth()

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="gap-4 px-5 pt-3 pb-12"
    >
      <Card variant="hero" spacing="lg" className="gap-2.5">
        <Typography variant="title" selectable>
          Login to continue
        </Typography>
        <Typography variant="body" tone="muted" selectable>
          Native Apple or Google sign-in, then backend-issued Sanctum token for authenticated API requests.
        </Typography>
      </Card>

      {error ? (
        <Card variant="panel" className="gap-2.5">
          <Typography variant="body" tone="subtle" selectable>
            {error}
          </Typography>
          <Button label="Dismiss" variant="secondary" onPress={clearError} />
        </Card>
      ) : null}

      {isAppleLoginAvailable ? (
        <Card variant="panel" className="items-center justify-center py-3">
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={12}
            style={{ width: '100%', height: 44 }}
            onPress={() => {
              if (!isLoading) {
                void loginWithApple()
              }
            }}
          />
        </Card>
      ) : null}

      <Button
        label="Continue with Google"
        icon="person.crop.circle.fill"
        onPress={() => void loginWithGoogle()}
        disabled={isLoading}
      />
    </ScrollView>
  )
}

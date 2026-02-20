import * as AppleAuthentication from 'expo-apple-authentication'

import { ScrollableLayout } from '~/shared/layouts'
import { useOAuth } from '~/shared/providers/OAuthProvider'
import { Button } from '~/ui/button'
import { Card } from '~/ui/card'
import { Typography } from '~/ui/typography'

export default function LoginScreen() {
  const { error, isAppleLoginAvailable, isLoading, loginWithApple, loginWithGoogle, clearError } = useOAuth()

  return (
    <ScrollableLayout>
      <Card.Root spacing="lg">
        <Card.Body>
          <Typography tone="muted">
            Native Apple or Google sign-in, then backend-issued Sanctum token for authenticated API requests.
          </Typography>
        </Card.Body>
      </Card.Root>

      {error ? (
        <Card.Root>
          <Card.Body>
            <Typography tone="subtle">{error}</Typography>
          </Card.Body>
          <Card.Footer>
            <Button variant="secondary" onPress={clearError}>
              Dismiss
            </Button>
          </Card.Footer>
        </Card.Root>
      ) : null}

      {isAppleLoginAvailable ? (
        <Card.Root>
          <Card.Body className="items-center justify-center py-3">
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
          </Card.Body>
        </Card.Root>
      ) : null}

      <Button icon="person.crop.circle.fill" onPress={() => void loginWithGoogle()} disabled={isLoading}>
        Continue with Google
      </Button>
    </ScrollableLayout>
  )
}

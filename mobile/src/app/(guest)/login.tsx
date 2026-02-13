import { useAuth } from '~/providers/auth-provider'
import { Button } from '~/ui/button'
import { Card } from '~/ui/card'
import { ScrollView } from '~/ui/tw'
import { Typography } from '~/ui/typography'

export default function LoginScreen() {
  const { authError, isAuthenticating, loginWithGoogle, clearAuthError } = useAuth()

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
          Native Google sign-in, then backend-issued Sanctum token for authenticated API requests.
        </Typography>
      </Card>

      {authError ? (
        <Card variant="panel" className="gap-2.5">
          <Typography variant="body" tone="subtle" selectable>
            {authError}
          </Typography>
          <Button label="Dismiss" variant="secondary" onPress={clearAuthError} />
        </Card>
      ) : null}

      <Button
        label="Continue with Google"
        icon="person.crop.circle.fill"
        onPress={() => void loginWithGoogle()}
        disabled={isAuthenticating}
      />
    </ScrollView>
  )
}

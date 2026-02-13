import { useRouter } from 'expo-router'

import { useAuth } from '~/providers/auth-provider'
import { Button } from '~/ui/button'
import { Card } from '~/ui/card'
import { ScrollView } from '~/ui/tw'
import { Typography } from '~/ui/typography'

export default function SessionScreen() {
  const router = useRouter()
  const { user, authError, isAuthenticating, logout } = useAuth()

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="gap-4 px-5 pt-3 pb-12"
    >
      <Card variant="hero" spacing="lg" className="gap-2.5">
        <Typography variant="title" selectable>
          Session
        </Typography>
        <Typography variant="body" tone="muted" selectable>
          This tab is available only while authenticated.
        </Typography>
      </Card>

      <Card variant="panel" className="gap-2.5">
        <Typography variant="heading" selectable>
          Account
        </Typography>
        <Typography variant="body" tone="muted" selectable>
          {user ? user.email : 'Unknown user'}
        </Typography>
        {authError ? (
          <Typography variant="body" tone="subtle" selectable>
            {authError}
          </Typography>
        ) : null}
      </Card>

      <Button label="Open About" variant="secondary" onPress={() => router.push('/about')} />
      <Button label="Sign out" onPress={() => void logout()} disabled={isAuthenticating} />
    </ScrollView>
  )
}

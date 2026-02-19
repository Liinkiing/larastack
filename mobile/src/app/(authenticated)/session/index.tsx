import { ScrollView } from 'react-native'

import { useAuth } from '~/shared/providers/AuthProvider'
import { useOAuth } from '~/shared/providers/OAuthProvider'
import { Button } from '~/ui/button'
import { Card } from '~/ui/card'
import { Typography } from '~/ui/typography'

export default function SessionScreen() {
  const { viewer } = useAuth()
  const { error, isLoading, logout } = useOAuth()

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
        {error ? (
          <Typography variant="body" tone="subtle" selectable>
            {error}
          </Typography>
        ) : null}
      </Card>

      <Card variant="panel" className="gap-2.5">
        <Typography variant="heading" selectable>
          GraphQL sanity check
        </Typography>

        <Typography variant="body" tone="muted" selectable>
          Viewer: {viewer.email}
        </Typography>
        <Typography variant="caption" tone="subtle" selectable>
          viewApp: {viewer.abilities.viewApp ? 'true' : 'false'}
        </Typography>
      </Card>

      <Button onPress={() => void logout()} disabled={isLoading}>
        Sign out
      </Button>
    </ScrollView>
  )
}

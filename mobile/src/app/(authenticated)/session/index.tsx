import { ScrollableLayout } from '~/shared/layouts'
import { useAuth } from '~/shared/providers/AuthProvider'
import { useOAuth } from '~/shared/providers/OAuthProvider'
import { Button } from '~/ui/button'
import { Card } from '~/ui/card'
import { Typography } from '~/ui/typography'

export default function SessionScreen() {
  const { viewer } = useAuth()
  const { isLoading, logout } = useOAuth()

  return (
    <ScrollableLayout>
      <Card.Root>
        <Card.Header>
          <Typography variant="title">Session</Typography>
        </Card.Header>
        <Card.Body>
          <Typography tone="muted">This tab is available only while authenticated.</Typography>
        </Card.Body>
      </Card.Root>

      <Card.Root>
        <Card.Header>
          <Typography variant="heading">GraphQL sanity check</Typography>
        </Card.Header>

        <Card.Body className="gap-2.5">
          <Typography tone="muted">Viewer: {viewer.email}</Typography>
          <Typography variant="caption" tone="subtle">
            viewApp: {viewer.abilities.viewApp ? 'true' : 'false'}
          </Typography>
        </Card.Body>
      </Card.Root>

      <Button variant="destructive" onPress={() => void logout()} disabled={isLoading}>
        Sign out
      </Button>
    </ScrollableLayout>
  )
}

import { useRouter } from 'expo-router'
import { useState } from 'react'

import { ScrollableLayout } from '~/shared/layouts'
import { Button } from '~/ui/button'
import { Card } from '~/ui/card'
import { Typography } from '~/ui/typography'

export default function HomeScreen() {
  const router = useRouter()
  const [sparkCount, setSparkCount] = useState(0)

  const handleSparkPress = () => setSparkCount(current => current + 1)

  return (
    <ScrollableLayout>
      <Card.Root>
        <Card.Header>
          <Typography variant="display">Playful, bright, and clean.</Typography>
        </Card.Header>

        <Card.Body>
          <Typography variant="body" tone="muted">
            Native tabs plus proper headers on each authenticated tab.
          </Typography>
        </Card.Body>

        <Card.Footer>
          <Button icon="star.fill" onPress={handleSparkPress}>
            Spark some joy
          </Button>
          <Button icon="person.crop.circle.fill" variant="secondary" onPress={() => router.push('/session')}>
            Open Session tab
          </Button>
        </Card.Footer>
      </Card.Root>

      <Card.Root>
        <Card.Header>
          <Typography variant="heading">Session vibe</Typography>
        </Card.Header>

        <Card.Body className="gap-3">
          <Card.Root spacing="sm" className="rounded-[14px]">
            <Card.Body className="flex-row items-center justify-between">
              <Typography variant="body" tone="muted">
                Spark taps
              </Typography>
              <Typography variant="metric" style={{ fontVariant: ['tabular-nums'] }}>
                {sparkCount}
              </Typography>
            </Card.Body>
          </Card.Root>
        </Card.Body>

        <Card.Footer>
          <Typography variant="body" tone="subtle">
            Tiny app, big color energy. Keep tapping to feel the haptic-enabled button.
          </Typography>
        </Card.Footer>
      </Card.Root>
    </ScrollableLayout>
  )
}

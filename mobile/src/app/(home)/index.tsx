import { useRouter } from 'expo-router'
import { useState } from 'react'

import { Button } from '~/ui/button'
import { Card } from '~/ui/card'
import { IconSymbol } from '~/ui/icon-symbol'
import { ScrollView, View } from '~/ui/tw'
import { Typography } from '~/ui/typography'

export default function HomeScreen() {
  const router = useRouter()
  const [sparkCount, setSparkCount] = useState(0)

  const handleSparkPress = () => setSparkCount(current => current + 1)

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="relative gap-4 px-5 pt-3 pb-12"
    >
      <View className="absolute -right-6 -top-10 h-44 w-44 rounded-full bg-bubble-orange/20" />
      <View className="absolute left-[-40px] top-[168px] h-[150px] w-[150px] rounded-full bg-bubble-teal/20" />

      <Card variant="hero" spacing="lg" className="gap-3">
        <View className="self-start flex-row items-center gap-1.5 rounded-pill border border-primary/30 bg-primary/10 px-2.5 py-1.5">
          <IconSymbol name="star.fill" size={14} color="#f97316" />
          <Typography variant="caption" tone="primary" selectable>
            Light mode playground
          </Typography>
        </View>

        <Typography variant="display" selectable>
          Playful, bright, and clean.
        </Typography>

        <Typography variant="body" tone="muted" selectable>
          We kept the native iOS 26 tabs and stacks, then reset everything else to a tiny app with a colorful
          personality.
        </Typography>

        <Button label="Spark some joy" icon="star.fill" onPress={handleSparkPress} />
        <Button
          label="Open About"
          icon="person.crop.circle.fill"
          variant="secondary"
          onPress={() => router.push('/about')}
        />
      </Card>

      <Card variant="panel" className="gap-3">
        <Typography variant="heading" selectable>
          Session vibe
        </Typography>

        <Card variant="item" spacing="sm" className="flex-row items-center justify-between rounded-[14px]">
          <Typography variant="body" tone="muted" selectable>
            Spark taps
          </Typography>
          <Typography variant="metric" style={{ fontVariant: ['tabular-nums'] }} selectable>
            {sparkCount}
          </Typography>
        </Card>

        <Typography variant="body" tone="subtle" selectable>
          Tiny app, big color energy. Keep tapping to feel the haptic-enabled button.
        </Typography>
      </Card>
    </ScrollView>
  )
}

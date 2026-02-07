import { useRouter } from 'expo-router'

import { Button } from '~/ui/button'
import { Card } from '~/ui/card'
import { IconSymbol } from '~/ui/icon-symbol'
import { ScrollView, View } from '~/ui/tw'
import { Typography } from '~/ui/typography'

const FEATURES = [
  {
    icon: 'house.fill',
    title: 'Native tabs',
    body: 'System tab chrome with smooth minimize-on-scroll behavior.',
  },
  {
    icon: 'star.fill',
    title: 'Playful palette',
    body: 'Bright tones, soft cards, and subtle depth for a happy baseline.',
  },
  {
    icon: 'person.crop.circle.fill',
    title: 'Simple structure',
    body: 'Only Home and About right now so the app stays focused.',
  },
] as const

export default function AboutScreen() {
  const router = useRouter()

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="gap-4 px-5 pt-3 pb-12"
    >
      <Card variant="hero" spacing="lg" className="gap-2.5">
        <Typography variant="title" selectable>
          A tiny base with iOS-native polish.
        </Typography>
        <Typography variant="body" tone="muted" selectable>
          This is intentionally minimal for now, but still keeps the modern native routing and tab experience you
          wanted.
        </Typography>
      </Card>

      <View className="gap-2.5">
        {FEATURES.map(item => (
          <Card key={item.title} variant="item" spacing="sm" className="flex-row items-start gap-2.5 rounded-2xl">
            <View className="h-[30px] w-[30px] items-center justify-center rounded-[10px] border border-primary/30 bg-primary/10">
              <IconSymbol name={item.icon} size={16} color="#ea580c" />
            </View>
            <View className="flex-1 gap-[3px]">
              <Typography variant="heading" selectable>
                {item.title}
              </Typography>
              <Typography variant="caption" tone="subtle" selectable>
                {item.body}
              </Typography>
            </View>
          </Card>
        ))}
      </View>

      <Button label="Back Home" icon="chevron.right" variant="primary" onPress={() => router.push('/')} />
    </ScrollView>
  )
}

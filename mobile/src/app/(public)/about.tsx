import { useRouter } from 'expo-router'

import { Button } from '~/ui/button'
import { Card } from '~/ui/card'
import { IconSymbol } from '~/ui/icon-symbol'
import { ScrollView, View } from '~/ui/tw'
import { Typography } from '~/ui/typography'

const FEATURES = [
  {
    icon: 'house.fill',
    title: 'Route groups',
    body: 'Authenticated, guest, and public sections are now separated by folder structure.',
  },
  {
    icon: 'star.fill',
    title: 'Protected guards',
    body: 'Screens are automatically enabled or blocked based on auth state.',
  },
  {
    icon: 'person.crop.circle.fill',
    title: 'Native auth flow',
    body: 'Google sign-in uses native UX and backend-issued Sanctum tokens.',
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
          A tiny base with clean route boundaries.
        </Typography>
        <Typography variant="body" tone="muted" selectable>
          Public screens stay open, guest screens stay logged-out only, and authenticated screens are protected.
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

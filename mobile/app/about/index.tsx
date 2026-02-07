import { useRouter } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { Button } from '~/components/ui/button'
import { IconSymbol } from '~/components/ui/icon-symbol'

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
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title} selectable>
          A tiny base with iOS-native polish.
        </Text>
        <Text style={styles.body} selectable>
          This is intentionally minimal for now, but still keeps the modern native routing and tab experience you
          wanted.
        </Text>
      </View>

      <View style={styles.featureList}>
        {FEATURES.map(item => (
          <View key={item.title} style={styles.featureCard}>
            <View style={styles.featureIconWrap}>
              <IconSymbol name={item.icon} size={16} color="#ea580c" />
            </View>
            <View style={styles.featureTextWrap}>
              <Text style={styles.featureTitle} selectable>
                {item.title}
              </Text>
              <Text style={styles.featureBody} selectable>
                {item.body}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Button label="Back Home" icon="chevron.right" variant="sunset" onPress={() => router.push('/')} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 48,
    gap: 16,
    backgroundColor: '#fffaf2',
  },
  card: {
    borderRadius: 22,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.45)',
    backgroundColor: 'rgba(255,255,255,0.92)',
    padding: 18,
    gap: 9,
    boxShadow: '0 18px 34px rgba(251,146,60,0.14)',
  },
  title: {
    color: '#1f2a44',
    fontSize: 27,
    lineHeight: 32,
    fontWeight: '700',
  },
  body: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 22,
  },
  featureList: {
    gap: 10,
  },
  featureCard: {
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(45,212,191,0.35)',
    backgroundColor: 'rgba(240,253,250,0.86)',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  featureIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.32)',
    backgroundColor: 'rgba(255,237,213,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextWrap: {
    flex: 1,
    gap: 3,
  },
  featureTitle: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
  },
  featureBody: {
    color: '#0f766e',
    fontSize: 13,
    lineHeight: 18,
  },
})

import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { Button } from '~/components/ui/button'
import { IconSymbol } from '~/components/ui/icon-symbol'

export default function HomeScreen() {
  const router = useRouter()
  const [sparkCount, setSparkCount] = useState(0)

  const handleSparkPress = () => setSparkCount(current => current + 1)

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
      <View style={styles.backdropBubbleOne} />
      <View style={styles.backdropBubbleTwo} />

      <View style={styles.heroCard}>
        <View style={styles.badge}>
          <IconSymbol name="star.fill" size={14} color="#f97316" />
          <Text style={styles.badgeText} selectable>
            Light mode playground
          </Text>
        </View>

        <Text style={styles.title} selectable>
          Playful, bright, and clean.
        </Text>

        <Text style={styles.description} selectable>
          We kept the native iOS 26 tabs and stacks, then reset everything else to a tiny app with a colorful
          personality.
        </Text>

        <Button label="Spark some joy" icon="star.fill" onPress={handleSparkPress} />
        <Button
          label="Open About"
          icon="person.crop.circle.fill"
          variant="mint"
          onPress={() => router.push('/about')}
        />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle} selectable>
          Session vibe
        </Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel} selectable>
            Spark taps
          </Text>
          <Text style={styles.rowValueNumber} selectable>
            {sparkCount}
          </Text>
        </View>

        <Text style={styles.panelBody} selectable>
          Tiny app, big color energy. Keep tapping to feel the haptic-enabled button.
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    position: 'relative',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 48,
    gap: 16,
    backgroundColor: '#fffaf2',
  },
  backdropBubbleOne: {
    position: 'absolute',
    top: -42,
    right: -24,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: 'rgba(251,146,60,0.20)',
  },
  backdropBubbleTwo: {
    position: 'absolute',
    top: 168,
    left: -40,
    width: 150,
    height: 150,
    borderRadius: 999,
    backgroundColor: 'rgba(45,212,191,0.22)',
  },
  heroCard: {
    borderCurve: 'continuous',
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.95)',
    padding: 20,
    gap: 12,
    boxShadow: '0 18px 34px rgba(249,115,22,0.16)',
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.30)',
    backgroundColor: 'rgba(255,237,213,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: '#9a3412',
  },
  title: {
    fontSize: 29,
    lineHeight: 34,
    fontWeight: '700',
    color: '#1f2a44',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
  },
  panel: {
    borderCurve: 'continuous',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(186,230,253,0.75)',
    padding: 16,
    gap: 12,
    boxShadow: '0 14px 26px rgba(56,189,248,0.14)',
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  row: {
    borderCurve: 'continuous',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(125,211,252,0.62)',
    backgroundColor: 'rgba(224,242,254,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    color: '#475569',
    fontSize: 14,
  },
  rowValue: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '600',
  },
  rowValueNumber: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  panelBody: {
    color: '#0f766e',
    fontSize: 14,
    lineHeight: 20,
  },
})

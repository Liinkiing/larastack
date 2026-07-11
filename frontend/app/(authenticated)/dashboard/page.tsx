'use client'

import { useAuth } from '~/shared/hooks/useAuth'
import { PageLayout } from '~/shared/layouts/PageLayout'
import { Button } from '~/ui/button'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

export default function HomePage() {
  const { viewer } = useAuth()

  return (
    <PageLayout>
      <div className="flex flex-col gap-8 md:gap-12">
        <section className="flex flex-col gap-3">
          <Heading as="h1">Welcome back, {viewer.name}</Heading>
          <Text size="lg" className="text-muted-foreground">
            Your workspace is humming. Here is a quick glance at what is moving today.
          </Text>
          <div className="flex flex-wrap gap-3">
            <Button size="sm" variant="soft">
              New project
            </Button>
            <Button size="sm" variant="outline">
              Invite team
            </Button>
          </div>
        </section>
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { detail: '4 are high priority', label: 'Open tasks', value: '18' },
            {
              detail: 'Last build 12 min ago',
              label: 'Deploy status',
              value: 'Green',
            },
            { detail: 'Up 8% this week', label: 'Sessions', value: '128' },
          ].map(card => (
            <article key={card.label} className="flex flex-col gap-2 rounded-3xl border border-border bg-card p-5">
              <Text size="sm" className="text-muted-foreground">
                {card.label}
              </Text>
              <Text className="font-display text-[1.625rem] leading-[1.15] font-bold">{card.value}</Text>
              <Text size="sm" className="text-muted-foreground">
                {card.detail}
              </Text>
            </article>
          ))}
        </section>
        <section className="rounded-3xl border border-primary bg-primary-soft p-6 md:p-8">
          <div className="flex flex-col gap-4">
            <Heading as="h3">Your focus for today</Heading>
            <Text className="text-muted-foreground">
              Tidy up the onboarding checklist, sync auth flow notes, and ship the next dashboard animation pass.
            </Text>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}

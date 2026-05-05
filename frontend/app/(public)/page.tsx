import { AppLink } from '~/shared/components/AppLink'
import { AuthenticatedGuard } from '~/shared/guards/AuthenticatedGuard'
import { PageLayout } from '~/shared/layouts/PageLayout'
import { Button } from '~/ui/button'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

export default function Home() {
  return (
    <PageLayout>
      <div className="flex flex-col gap-10 md:gap-16">
        <div className="grid gap-8 md:gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="animate-fade-in space-y-5 md:space-y-6">
            <div className="flex w-fit items-center gap-3 rounded-full border border-border-subtle bg-surface px-4 py-2">
              <span className="size-2.5 rounded-full bg-accent" />
              <Text className="font-semibold tracking-[0.02em]" size="sm" tone="muted">
                Playful, modern, and ready to ship
              </Text>
            </div>
            <Heading as="h1">Build bold experiences with a gentle, cherry-bright rhythm.</Heading>
            <Text className="max-w-[520px]" size="lg" tone="muted">
              Larastack pairs Laravel and Next.js in a lively, crafted shell that feels warm, human, and fast. It is
              colorful without shouting, and expressive without the noise.
            </Text>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <AuthenticatedGuard
                fallback={
                  <>
                    <Button asChild size="lg">
                      <AppLink href="/auth/login">Start a session</AppLink>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <AppLink href="/dashboard">View dashboard</AppLink>
                    </Button>
                  </>
                }
              >
                <Button asChild size="lg">
                  <AppLink href="/dashboard">View dashboard</AppLink>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <AppLink href="#">Close your session</AppLink>
                </Button>
              </AuthenticatedGuard>
            </div>
            <div className="flex flex-col flex-wrap gap-3 sm:flex-row sm:gap-6">
              {['GraphQL-first', 'Zero-friction auth', 'Design tokens baked in'].map(label => (
                <div className="flex items-center gap-2" key={label}>
                  <span className="size-2 rounded-full bg-accent-mint" />
                  <Text size="sm" tone="muted">
                    {label}
                  </Text>
                </div>
              ))}
            </div>
          </section>
          <section className="animate-fade-in space-y-4 [animation-delay:120ms]">
            <div className="rounded-[24px] border border-border-subtle bg-surface p-5 md:p-6">
              <div className="flex flex-col gap-5">
                <div className="flex justify-between">
                  <Text bold>Daily pulse</Text>
                  <Text size="sm" tone="muted">
                    2 min read
                  </Text>
                </div>
                <Heading as="h3">A softer dashboard for fast teams.</Heading>
                <Text tone="muted">
                  Curate your next deploy, see the auth rhythm, and keep teams aligned in a view that feels alive.
                </Text>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: 'Active sessions', value: '128' },
                    { label: 'Build time', value: '4m 12s' },
                    { label: 'Incidents', value: '0' },
                    { label: 'PRs merged', value: '34' },
                  ].map(item => (
                    <div className="flex flex-col gap-1 rounded-[20px] bg-surface-muted p-4" key={item.label}>
                      <Text size="sm" tone="muted">
                        {item.label}
                      </Text>
                      <Text className="font-display" bold size="lg">
                        {item.value}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  body: 'Colocated fragments keep data tidy.',
                  title: 'GraphQL ready',
                },
                {
                  body: 'Tailwind tokens keep the palette consistent.',
                  title: 'Token driven',
                },
                {
                  body: 'Sanctum plus social login out of the box.',
                  title: 'Auth flows',
                },
                {
                  body: 'Subtle animation cues everywhere.',
                  title: 'Motion polish',
                },
              ].map(card => (
                <div
                  className="flex flex-col gap-2 rounded-[18px] border border-border-subtle bg-surface p-4"
                  key={card.title}
                >
                  <Text className="font-display" bold>
                    {card.title}
                  </Text>
                  <Text size="sm" tone="muted">
                    {card.body}
                  </Text>
                </div>
              ))}
            </div>
          </section>
        </div>
        <section className="flex animate-fade-in flex-col flex-wrap items-start justify-between gap-6 rounded-[32px] border border-border-subtle bg-surface p-6 [animation-delay:200ms] md:gap-10 md:p-10 lg:flex-row lg:items-center">
          <div className="flex max-w-full flex-col items-start gap-2 lg:max-w-[520px]">
            <Heading as="h2">Turn the skeleton into a studio.</Heading>
            <Text size="lg" tone="muted">
              Swap the placeholder screens for a bold product experience. This kit gives you the rhythm, you decide the
              melody.
            </Text>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg" variant="soft">
              <AppLink href="/terms">Read the terms</AppLink>
            </Button>
            <Button asChild size="lg">
              <AppLink href="/auth/login">Join the flow</AppLink>
            </Button>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}

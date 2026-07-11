import { AppLink } from '~/shared/components/AppLink'
import { AuthenticatedGuard } from '~/shared/guards/AuthenticatedGuard'
import { PageLayout } from '~/shared/layouts/PageLayout'
import { buttonVariants } from '~/ui/button'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

const metrics = [
  { label: 'Active sessions', value: '128' },
  { label: 'Build time', value: '4m 12s' },
  { label: 'Incidents', value: '0' },
  { label: 'PRs merged', value: '34' },
]

const featureCards = [
  { body: 'Colocated fragments keep data tidy.', title: 'GraphQL ready' },
  { body: 'Tailwind keeps the design language consistent.', title: 'Token driven' },
  { body: 'Sanctum plus social login out of the box.', title: 'Auth flows' },
  { body: 'Subtle animation cues everywhere.', title: 'Motion polish' },
]

export default function Home() {
  return (
    <PageLayout>
      <div className="flex flex-col gap-10 md:gap-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <section className="flex animate-fade-in flex-col gap-5 md:gap-6">
            <div className="flex w-fit items-center gap-3 rounded-full border border-border bg-card px-4 py-2">
              <span className="size-2.5 rounded-full bg-primary" />
              <Text as="span" size="sm" className="font-semibold tracking-[0.02em] text-muted-foreground">
                Playful, modern, and ready to ship
              </Text>
            </div>
            <Heading as="h1">Build bold experiences with a gentle, cherry-bright rhythm.</Heading>
            <Text size="lg" className="max-w-130 text-muted-foreground">
              Larastack pairs Laravel and Next.js in a lively, crafted shell that feels warm, human, and fast. It is
              colorful without shouting, and expressive without the noise.
            </Text>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <AuthenticatedGuard
                fallback={
                  <>
                    <AppLink className={buttonVariants({ size: 'lg' })} href="/auth/login">
                      Start a session
                    </AppLink>
                    <AppLink className={buttonVariants({ size: 'lg', variant: 'outline' })} href="/dashboard">
                      View dashboard
                    </AppLink>
                  </>
                }
              >
                <AppLink className={buttonVariants({ size: 'lg' })} href="/dashboard">
                  View dashboard
                </AppLink>
                <AppLink className={buttonVariants({ size: 'lg', variant: 'outline' })} href="#">
                  Close your session
                </AppLink>
              </AuthenticatedGuard>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
              {['GraphQL-first', 'Zero-friction auth', 'Design tokens baked in'].map(label => (
                <div key={label} className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-mint" />
                  <Text size="sm" className="text-muted-foreground">
                    {label}
                  </Text>
                </div>
              ))}
            </div>
          </section>

          <section className="flex animate-fade-in flex-col gap-4 [animation-delay:120ms]">
            <div className="rounded-3xl border border-border bg-card p-5 md:p-6">
              <div className="flex flex-col gap-5">
                <div className="flex justify-between gap-4">
                  <Text className="font-bold">Daily pulse</Text>
                  <Text size="sm" className="text-muted-foreground">
                    2 min read
                  </Text>
                </div>
                <Heading as="h3">A softer dashboard for fast teams.</Heading>
                <Text className="text-muted-foreground">
                  Curate your next deploy, see the auth rhythm, and keep teams aligned in a view that feels alive.
                </Text>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {metrics.map(item => (
                    <div key={item.label} className="flex flex-col gap-1 rounded-2xl bg-muted p-4">
                      <Text size="sm" className="text-muted-foreground">
                        {item.label}
                      </Text>
                      <Text size="lg" className="font-display font-bold">
                        {item.value}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {featureCards.map(card => (
                <div key={card.title} className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
                  <Text className="font-display font-bold">{card.title}</Text>
                  <Text size="sm" className="text-muted-foreground">
                    {card.body}
                  </Text>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="flex animate-fade-in flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-card p-6 [animation-delay:200ms] md:items-center md:gap-10 md:p-10 lg:flex-row">
          <div className="flex max-w-130 flex-col items-start gap-2">
            <Heading as="h2">Turn the skeleton into a studio.</Heading>
            <Text size="lg" className="text-muted-foreground">
              Swap the placeholder screens for a bold product experience. This kit gives you the rhythm, you decide the
              melody.
            </Text>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <AppLink className={buttonVariants({ size: 'lg', variant: 'soft' })} href="/terms">
              Read the terms
            </AppLink>
            <AppLink className={buttonVariants({ size: 'lg' })} href="/auth/login">
              Join the flow
            </AppLink>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}

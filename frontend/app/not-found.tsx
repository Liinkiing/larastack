import { AppLink } from '~/shared/components/AppLink'
import { PageLayout } from '~/shared/layouts/PageLayout'
import { Button } from '~/ui/button'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

export default function NotFound() {
  return (
    <PageLayout>
      <div className="flex flex-col gap-8 md:gap-12">
        <section className="flex max-w-[520px] animate-fade-in flex-col items-start gap-4">
          <div className="flex w-fit items-center gap-3 rounded-full border border-border-subtle bg-surface px-4 py-2">
            <span className="size-2.5 rounded-full bg-accent" />
            <Text className="font-semibold tracking-[0.02em]" size="sm" tone="muted">
              404 — This page slipped off the grid
            </Text>
          </div>
          <Heading as="h1">Lost in the soft glow.</Heading>
          <Text size="lg" tone="muted">
            We couldn&apos;t find that page, but the rest of the stack is humming. Glide back home or sign in.
          </Text>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg">
              <AppLink href="/">Back home</AppLink>
            </Button>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}

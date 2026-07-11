import { AppLink } from '~/shared/components/AppLink'
import { PageLayout } from '~/shared/layouts/PageLayout'
import { buttonVariants } from '~/ui/button'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

export default function NotFound() {
  return (
    <PageLayout>
      <div className="flex flex-col gap-8 md:gap-12">
        <section className="flex max-w-130 animate-fade-in flex-col items-start gap-4">
          <div className="flex w-fit items-center gap-3 rounded-full border border-border bg-card px-4 py-2">
            <span className="size-2.5 rounded-full bg-primary" />
            <Text size="sm" className="font-semibold tracking-[0.02em] text-muted-foreground">
              404 — This page slipped off the grid
            </Text>
          </div>
          <Heading as="h1">Lost in the soft glow.</Heading>
          <Text size="lg" className="text-muted-foreground">
            We couldn&apos;t find that page, but the rest of the stack is humming. Glide back home or sign in.
          </Text>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <AppLink className={buttonVariants({ size: 'lg' })} href="/">
              Back home
            </AppLink>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}

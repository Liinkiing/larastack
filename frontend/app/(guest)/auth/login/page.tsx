'use client'

import { AppLink } from '~/shared/components/AppLink'
import { useAuth } from '~/shared/hooks/useAuth'
import { PageLayout } from '~/shared/layouts/PageLayout'
import { Button } from '~/ui/button'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

export default function LoginPage() {
  const { loginWithProvider } = useAuth()

  return (
    <PageLayout>
      <div className="mx-auto max-w-[520px]">
        <section className="flex animate-fade-in flex-col gap-5 rounded-[28px] border border-border-subtle bg-surface p-6 md:p-8">
          <div className="flex flex-col gap-2">
            <Heading as="h1">Welcome back</Heading>
            <Text tone="muted">
              Step into your workspace with a quick sign-in. We will keep it light, quick, and secure.
            </Text>
          </div>
          <Button size="lg" onClick={() => loginWithProvider('google')}>
            Continue with Google
          </Button>
          <div className="flex items-center justify-between gap-4">
            <Text size="sm" tone="muted">
              By continuing, you agree to our terms.
            </Text>
            <Button asChild size="sm" variant="ghost">
              <AppLink href="/terms">See terms</AppLink>
            </Button>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}

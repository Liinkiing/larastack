'use client'

import { AppLink } from '~/shared/components/AppLink'
import { useAuth } from '~/shared/hooks/useAuth'
import { PageLayout } from '~/shared/layouts/PageLayout'
import { Button, buttonVariants } from '~/ui/button'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

export default function LoginPage() {
  const { loginWithProvider } = useAuth()

  return (
    <PageLayout>
      <div className="mx-auto max-w-130">
        <section className="flex animate-fade-in flex-col gap-5 rounded-3xl border border-border bg-card p-6 md:p-8">
          <div className="flex flex-col gap-2">
            <Heading as="h1">Welcome back</Heading>
            <Text className="text-muted-foreground">
              Step into your workspace with a quick sign-in. We will keep it light, quick, and secure.
            </Text>
          </div>
          <Button size="lg" onClick={() => loginWithProvider('google')}>
            Continue with Google
          </Button>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <Text size="sm" className="text-muted-foreground">
              By continuing, you agree to our terms.
            </Text>
            <AppLink className={buttonVariants({ size: 'sm', variant: 'ghost' })} href="/terms">
              See terms
            </AppLink>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}

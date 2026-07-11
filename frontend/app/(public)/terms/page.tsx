import type { Metadata } from 'next'

import { PageLayout } from '~/shared/layouts/PageLayout'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

export const metadata: Metadata = {
  description: 'Terms and conditions',
  title: 'Terms',
}

export default function TermsPage() {
  return (
    <PageLayout>
      <div className="flex max-w-180 flex-col gap-6">
        <Heading as="h1">Terms</Heading>
        <Text className="text-muted-foreground">
          By using Larastack you agree to keep credentials safe, respect rate limits, and avoid misuse of the platform.
          We keep the service friendly, fast, and reliable for everyone.
        </Text>
        <section className="flex flex-col gap-4">
          <Heading as="h3">Acceptable use</Heading>
          <Text className="text-muted-foreground">
            Do not attempt to break, overload, or reverse engineer the service. Keep content professional and comply
            with applicable regulations.
          </Text>
        </section>
        <section className="flex flex-col gap-4">
          <Heading as="h3">Service updates</Heading>
          <Text className="text-muted-foreground">
            We may refine or update features, and we will do our best to announce major changes ahead of time.
          </Text>
        </section>
      </div>
    </PageLayout>
  )
}

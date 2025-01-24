'use client'

import { useAuth } from '~/shared/hooks/useAuth'
import { PageLayout } from '~/shared/layouts/PageLayout'
import { Button } from '~/ui/button'
import { Heading } from '~/ui/heading'

export default function LoginPage() {
  const { loginWithProvider } = useAuth()

  return (
    <PageLayout>
      <Heading as="h1">Login</Heading>
      <Button onClick={() => loginWithProvider('google')}>Connect with Google</Button>
    </PageLayout>
  )
}

import { PageLayout } from '~/shared/layouts/PageLayout'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

export default function Home() {
  return (
    <PageLayout>
      <Heading as="h1">Welcome</Heading>
      <Text>To your home</Text>
    </PageLayout>
  )
}

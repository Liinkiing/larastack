import { Grid } from '~/styled-system/jsx'
import { Heading } from '~/ui/heading'
import { Text } from '~/ui/text'

export default function Home() {
  return (
    <Grid placeItems="center">
      <Heading as="h1">Welcome</Heading>
      <Text>To your home</Text>
    </Grid>
  )
}

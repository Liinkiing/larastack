import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { VStack } from '~/styled-system/jsx'
import { heading } from '~/styled-system/recipes'
import { Heading } from '~/ui/heading'
import { disableArgTypes, generatePandaVariantsArgTypes } from '~/utils/storybook'

const meta = {
  argTypes: {
    as: { control: { disable: true }, table: { disable: true } },
    ...generatePandaVariantsArgTypes(heading),
  },
  component: Heading,
  title: 'Typography/Heading',
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

const TEXT = 'The quick brown fox jumps over the lazy dog'

export const All = {
  argTypes: disableArgTypes(['size']),
  render: args => (
    <VStack alignItems="flex-start" gap="0">
      <Heading as="h1" {...args}>
        {TEXT}
      </Heading>
      <Heading as="h2" {...args}>
        {TEXT}
      </Heading>
      <Heading as="h3" {...args}>
        {TEXT}
      </Heading>
      <Heading as="h4" {...args}>
        {TEXT}
      </Heading>
      <Heading as="h5" {...args}>
        {TEXT}
      </Heading>
      <Heading as="h6" {...args}>
        {TEXT}
      </Heading>
    </VStack>
  ),
} satisfies Story

export const Playground = {
  args: {
    as: 'h2',
    children: TEXT,
    size: 'h2',
  },
} satisfies Story

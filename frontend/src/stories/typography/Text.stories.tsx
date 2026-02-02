import type { Meta, StoryObj } from '@storybook/react'

import { VStack } from '~/styled-system/jsx'
import { text } from '~/styled-system/recipes'
import { Text } from '~/ui/text'
import { disableArgTypes, generatePandaVariantsArgTypes } from '~/utils/storybook'

const meta = {
  argTypes: {
    as: { control: { disable: true }, table: { disable: true } },
    ...generatePandaVariantsArgTypes(text),
  },
  args: {
    size: 'md',
  },
  component: Text,
  title: 'Typography/Text',
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

const TEXT = 'The quick brown fox jumps over the lazy dog'

export const All = {
  argTypes: disableArgTypes(['size']),
  render: args => (
    <VStack alignItems="flex-start" gap="0">
      <Text {...args} size="lg">
        {TEXT}
      </Text>
      <Text {...args} size="md">
        {TEXT}
      </Text>
      <Text {...args} size="sm">
        {TEXT}
      </Text>
    </VStack>
  ),
} satisfies Story

export const Playground = {
  args: {
    children: TEXT,
    size: 'lg',
  },
}

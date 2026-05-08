import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Text } from '~/ui/text'
import { disableArgTypes, generateVariantArgTypes } from '~/utils/storybook'

const meta = {
  argTypes: {
    as: { control: { disable: true }, table: { disable: true } },
    ...generateVariantArgTypes({
      bold: ['true', 'false'],
      italic: ['true', 'false'],
      medium: ['true', 'false'],
      normal: ['true', 'false'],
      semibold: ['true', 'false'],
      size: ['sm', 'md', 'lg'],
      tone: ['default', 'muted', 'disabled'],
      underline: ['true', 'false'],
      uppercase: ['true', 'false'],
    }),
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
    <div className="flex flex-col items-start gap-0">
      <Text {...args} size="lg">
        {TEXT}
      </Text>
      <Text {...args} size="md">
        {TEXT}
      </Text>
      <Text {...args} size="sm">
        {TEXT}
      </Text>
    </div>
  ),
} satisfies Story

export const Playground = {
  args: {
    children: TEXT,
    size: 'lg',
  },
}

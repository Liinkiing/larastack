import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '~/ui/button'

const meta = {
  args: {
    children: 'Label',
  },
  component: Button,
  title: 'UI/Button',
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary = {} satisfies Story

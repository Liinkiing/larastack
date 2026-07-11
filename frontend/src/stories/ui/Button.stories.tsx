import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button } from '~/ui/button'
import { generateVariantArgTypes } from '~/utils/storybook'

const meta = {
  argTypes: generateVariantArgTypes({
    size: ['sm', 'md', 'lg', 'icon'],
    variant: ['solid', 'soft', 'outline', 'ghost', 'destructive', 'link'],
  }),
  args: {
    children: 'Label',
    size: 'md',
    variant: 'solid',
  },
  component: Button,
  title: 'UI/Button',
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Solid = {
  args: {
    variant: 'solid',
  },
} satisfies Story

export const Soft = {
  args: {
    variant: 'soft',
  },
} satisfies Story

export const Ghost = {
  args: {
    variant: 'ghost',
  },
} satisfies Story

export const Outline = {
  args: {
    variant: 'outline',
  },
} satisfies Story

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { button } from '~/styled-system/recipes'
import { Button } from '~/ui/button'
import { generatePandaVariantsArgTypes } from '~/utils/storybook'

const meta = {
  argTypes: generatePandaVariantsArgTypes(button),
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
    variant: 'Outline',
  },
}

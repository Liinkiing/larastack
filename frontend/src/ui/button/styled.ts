import { ark } from '@ark-ui/react/factory'

import type { ComponentProps } from '~/styled-system/types'

import { styled } from '~/styled-system/jsx'
import { button } from '~/styled-system/recipes'

export type ButtonProps = ComponentProps<typeof Button>
export const Button = styled(ark.button, button)

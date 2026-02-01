import type { ElementType } from 'react'

import type { TextVariantProps } from '~/styled-system/recipes'
import type { ComponentProps, StyledComponent } from '~/styled-system/types'

import { styled } from '~/styled-system/jsx'
import { text } from '~/styled-system/recipes'

type Props = TextVariantProps & { as?: ElementType }

export type TextProps = ComponentProps<typeof Text>
export const Text = styled('p', text) as StyledComponent<'p', Props>

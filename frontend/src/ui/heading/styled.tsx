import type { FC } from 'react'

import { styled } from '~/styled-system/jsx'
import type { HeadingVariantProps } from '~/styled-system/recipes'
import { heading } from '~/styled-system/recipes'
import type { ComponentProps, StyledComponent } from '~/styled-system/types'

type Props = HeadingVariantProps & { as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }

export type HeadingProps = ComponentProps<typeof StyledHeading>
const StyledHeading = styled('h2', heading) as StyledComponent<'h2', Props>

export const Heading: FC<HeadingProps> = ({ as, size, ...props }) => {
  return <StyledHeading {...props} as={as} size={size ?? as ?? 'h2'} />
}

Heading.displayName = 'Heading'

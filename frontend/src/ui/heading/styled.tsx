import { forwardRef } from 'react'

import { styled } from '~/styled-system/jsx'
import type { HeadingVariantProps } from '~/styled-system/recipes'
import { heading } from '~/styled-system/recipes'
import type { ComponentProps, StyledComponent } from '~/styled-system/types'

type Props = HeadingVariantProps & { as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }

export type HeadingProps = ComponentProps<typeof StyledHeading>
const StyledHeading = styled('h2', heading) as StyledComponent<'h2', Props>

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as = 'h2', size, ...props }: HeadingProps, ref) => (
    <StyledHeading {...props} ref={ref} as={as} size={size ?? as ?? 'h2'} />
  ),
)

Heading.displayName = 'Heading'

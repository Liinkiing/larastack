import type { FC, ReactElement, ReactNode } from 'react'

export interface ConditionalWrapperProps {
  readonly when: boolean
  readonly children: ReactNode
  readonly wrapper: (children: ReactNode) => ReactNode
}

export const ConditionalWrapper: FC<ConditionalWrapperProps> = ({ children, when, wrapper }) =>
  when === true ? (wrapper(children) as ReactElement) : (children as ReactElement)

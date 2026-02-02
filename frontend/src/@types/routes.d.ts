import { LinkProps } from '@tanstack/react-router'

export type AppHref = Exclude<LinkProps['to'], undefined>

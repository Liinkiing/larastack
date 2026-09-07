import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Heading } from './index'

describe('Heading', () => {
  it('renders an h2 by default', () => {
    render(<Heading>Account settings</Heading>)

    expect(screen.getByRole('heading', { level: 2, name: 'Account settings' })).toBeInTheDocument()
  })

  it('renders the requested semantic heading level', () => {
    render(<Heading as="h3">Security</Heading>)

    expect(screen.getByRole('heading', { level: 3, name: 'Security' })).toBeInTheDocument()
  })
})

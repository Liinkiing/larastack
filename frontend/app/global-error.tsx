'use client'

import type { ErrorComponent } from 'next/dist/client/components/error-boundary'

import { Button } from '~/ui/button'

const GlobalError: ErrorComponent = ({ reset }) => (
  <html lang="en">
    <body>
      <h2>Something went wrong!</h2>
      <Button
        onClick={() => {
          if (reset) {
            reset()
          } else {
            globalThis.location.reload()
          }
        }}
      >
        Try again
      </Button>
    </body>
  </html>
)
export default GlobalError

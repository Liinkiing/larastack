import { defineTextStyles } from '@pandacss/dev'

export const textStyles = defineTextStyles({
  body: {
    lg: {
      value: {
        fontSize: 'body.lg',
      },
    },
    md: {
      value: {
        fontSize: 'body.md',
      },
    },
    sm: {
      value: {
        fontSize: 'body.sm',
      },
    },
  },
  heading: {
    h1: {
      value: {
        fontSize: {
          base: 'heading.mobile.2xl',
          sm: 'heading.desktop.2xl',
        },
        fontWeight: 'bold',
      },
    },
    h2: {
      value: {
        fontSize: {
          base: 'heading.mobile.lg',
          sm: 'heading.desktop.lg',
        },
        fontWeight: 'bold',
      },
    },
    h3: {
      value: {
        fontSize: {
          base: 'heading.mobile.md',
          sm: 'heading.desktop.md',
        },
        fontWeight: 'bold',
      },
    },
    h4: {
      value: {
        fontSize: {
          base: 'heading.mobile.sm',
          sm: 'heading.desktop.sm',
        },
        fontWeight: 'bold',
      },
    },
    h5: {
      value: {
        fontSize: {
          base: 'heading.mobile.xs',
          sm: 'heading.desktop.xs',
        },
        fontWeight: 'bold',
      },
    },
    h6: {
      value: {
        fontSize: {
          base: 'heading.mobile.xs',
          sm: 'heading.desktop.xs',
        },
        fontWeight: 'bold',
      },
    },
  },
})

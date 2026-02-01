import { defineTextStyles } from '@pandacss/dev'

export const textStyles = defineTextStyles({
  body: {
    lg: {
      value: {
        fontSize: 'body.lg',
        lineHeight: '1.7',
      },
    },
    md: {
      value: {
        fontSize: 'body.md',
        lineHeight: '1.65',
      },
    },
    sm: {
      value: {
        fontSize: 'body.sm',
        lineHeight: '1.6',
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
        fontWeight: '600',
        letterSpacing: '-0.03em',
        lineHeight: '1.05',
      },
    },
    h2: {
      value: {
        fontSize: {
          base: 'heading.mobile.lg',
          sm: 'heading.desktop.lg',
        },
        fontWeight: '600',
        letterSpacing: '-0.025em',
        lineHeight: '1.1',
      },
    },
    h3: {
      value: {
        fontSize: {
          base: 'heading.mobile.md',
          sm: 'heading.desktop.md',
        },
        fontWeight: '600',
        letterSpacing: '-0.02em',
        lineHeight: '1.15',
      },
    },
    h4: {
      value: {
        fontSize: {
          base: 'heading.mobile.sm',
          sm: 'heading.desktop.sm',
        },
        fontWeight: '600',
        letterSpacing: '-0.01em',
        lineHeight: '1.25',
      },
    },
    h5: {
      value: {
        fontSize: {
          base: 'heading.mobile.xs',
          sm: 'heading.desktop.xs',
        },
        fontWeight: '600',
        lineHeight: '1.3',
      },
    },
    h6: {
      value: {
        fontSize: {
          base: 'heading.mobile.xs',
          sm: 'heading.desktop.xs',
        },
        fontWeight: '600',
        lineHeight: '1.3',
      },
    },
  },
})

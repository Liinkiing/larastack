import { defineTextStyles } from '@pandacss/dev'

export const textStyles = defineTextStyles({
  body: {
    lg: {
      value: {
        fontSize: 'body.lg',
        lineHeight: 'normal',
      },
    },
    md: {
      value: {
        fontSize: 'body.md',
        lineHeight: 'normal',
      },
    },
    sm: {
      value: {
        fontSize: 'body.sm',
        lineHeight: 'normal',
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
        lineHeight: 'normal',
      },
    },
    h2: {
      value: {
        fontSize: {
          base: 'heading.mobile.lg',
          sm: 'heading.desktop.lg',
        },
        fontWeight: 'bold',
        lineHeight: 'normal',
      },
    },
    h3: {
      value: {
        fontSize: {
          base: 'heading.mobile.md',
          sm: 'heading.desktop.md',
        },
        fontWeight: 'bold',
        lineHeight: 'normal',
      },
    },
    h4: {
      value: {
        fontSize: {
          base: 'heading.mobile.sm',
          sm: 'heading.desktop.sm',
        },
        fontWeight: 'bold',
        lineHeight: 'normal',
      },
    },
    h5: {
      value: {
        fontSize: {
          base: 'heading.mobile.xs',
          sm: 'heading.desktop.xs',
        },
        fontWeight: 'black',
        lineHeight: 'normal',
      },
    },
    h6: {
      value: {
        fontSize: {
          base: 'heading.mobile.xs',
          sm: 'heading.desktop.xs',
        },
        fontWeight: 'bold',
        lineHeight: 'normal',
      },
    },
  },
})

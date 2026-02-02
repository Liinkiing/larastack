export const routes = {
  auth: {
    login: {
      root: '/auth/login',
    },
  },
  dashboard: {
    root: '/dashboard',
  },
  privacyPolicy: {
    root: '/privacy',
  },
  root: '/',
  terms: {
    root: '/terms',
  },
} as const

if (typeof window !== 'undefined') {
  performance.mark('app-init')

  window.addEventListener('error', _event => {
    // Add actual error reporting service here for exemple Sentry
  })
}

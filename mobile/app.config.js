module.exports = ({ config }) => ({
  ...config,
  plugins: [
    ...(config.plugins ?? []),
    [
      'expo-build-properties',
      {
        ios: {
          extraPods: [
            {
              name: 'GoogleUtilities',
              modular_headers: true,
            },
            {
              name: 'RecaptchaInterop',
              modular_headers: true,
            },
          ],
        },
      },
    ],
  ],
})

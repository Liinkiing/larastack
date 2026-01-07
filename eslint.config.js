import js from '@eslint/js'

export default [
  {
    ignores: ['backend/public/vendor/**/*'],
  },
  js.configs.recommended,
]

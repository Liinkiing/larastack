const { join } = require('node:path')

// lint-staged runs oxlint from the repo root, where the Panda oxlint plugin cannot discover a
// config on its own; without this, building frontend/.oxlintrc.json fails and every frontend rule
// is skipped. Panda resolves `include` against the working directory, so cwd-dependent rules such
// as `file-not-included` stay off and the frontend `lint` script remains the authority.
process.env.PANDA_CONFIG_PATH ??= join(__dirname, 'frontend', 'panda.config.ts')

module.exports = {
  '*.{js,jsx,ts,tsx}': ['oxlint --fix --no-error-on-unmatched-pattern'],
  '*.{js,jsx,ts,tsx,json}': 'oxfmt --write',
}

module.exports = {
  '*.{js,jsx,ts,tsx}': ['oxlint --fix --no-error-on-unmatched-pattern'],
  '*.{js,jsx,ts,tsx,json}': 'oxfmt --write',
}

module.exports = {
  '*.{js,jsx,ts,tsx}': ['oxlint --fix'],
  '*.{js,jsx,ts,tsx,json}': 'oxfmt --write',
}

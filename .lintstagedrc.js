module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --cache --fix'],
  '*.{js,jsx,ts,tsx,json,md,mdx,svg,html,css}': 'prettier --ignore-unknown --write',
}

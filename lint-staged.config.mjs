export default {
  '**/*.{ts,js,tsx,jsx,mjs,json,md,mdx,scss,html,yml}': (f) =>
    `npx nx format:write --files=${f.join(',')}`,
  '{apps,libs,tools}/**/*.{ts,tsx,js,jsx}':
    'eslint --flag v10_config_lookup_from_file',
  '{apps,libs,tools}/**/*.{css,scss}': 'stylelint --fix',
  '*.svg': 'svgo',
};

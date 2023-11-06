export default {
  '**/*.{ts,js,tsx,jsx,mjs,json,md,mdx,scss,html,yml}': (f) =>
    `npx nx format:write --files=${f.join(',')}`,
  '{apps,libs,tools}/**/*.{ts,tsx,js,jsx}': 'eslint',
  '{apps,libs,tools}/**/*.{css,scss}': 'stylelint --fix',
};

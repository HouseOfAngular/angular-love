export default {
  '**/*.{ts,js,tsx,jsx,mjs,json,md,mdx,scss,html,yml}': (f) =>
    `npx nx format:write --files=${f.join(',')}`,
  '{apps,libs}/**/jest.config.ts': (files) =>
    `node ./scripts/validate-jest-configs.mjs --files=${files.join(',')}`,
  '{apps,libs,tools}/**/*.{ts,tsx,js,jsx}': 'eslint',
  '{apps,libs,tools}/**/*.{css,scss}': 'stylelint --fix',
  '{apps,libs,tools}/**/*.ts': 'npm run lint:with-type-checker --',
};

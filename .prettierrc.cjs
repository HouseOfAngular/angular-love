const packageJson = require('./package.json');

const sortedPackages = Object.keys(packageJson.dependencies)
  .concat(Object.keys(packageJson.devDependencies))
  .sort()
  .map((p) => `^${p.replace('/', '\\/')}.*`)
  .join('|');

/** @type {import("prettier").Config} */
const config = {
  singleQuote: true,
  plugins: [
    'prettier-plugin-organize-attributes',
    'prettier-plugin-tailwindcss',
    '@ianvs/prettier-plugin-sort-imports',
  ],
  htmlWhitespaceSensitivity: 'ignore',
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
  importOrder: [
    sortedPackages,
    '',
    '^@[\\w-]+\\/(.*)$',
    '',
    '^((\\.\\.\\/)|(\\.\\/\\.\\.\\/)|(\\.\\.))',
    '',
    '^\\./',
  ],
  attributeGroups: [
    '^(id|name)$',
    '$ANGULAR_STRUCTURAL_DIRECTIVE',
    '^app',
    '^al',
    '$ANGULAR_ELEMENT_REF',
    'data-testid',
    'tabindex',
    '$ALT',
    '$ARIA',
    '$ROLE',
    '$TYPE',
    '$CLASS',
    'ngClass',
    '^\\[style',
    'ANGULAR_ANIMATION',
    '$ANGULAR_ANIMATION_INPUT',
    '^\\[attr',
    '$ANGULAR_TWO_WAY_BINDING',
    '$ANGULAR_INPUT',
    '^(\\(blur\\)|\\(focus\\)|)$',
    '^(\\(click\\)|\\(dbclick\\)|\\(submit\\))$',
    '^(\\(cut\\)|\\(copy\\)|\\(paste\\))$',
    '^(\\(keyup\\)|\\(keypress\\)|\\(keydown\\))$',
    '^(\\(mouseup\\)|\\(mousedown\\)|\\(mouseenter\\)|\\(scroll\\))$',
    '^(\\(drag\\)|\\(drop\\)|\\(dragover\\))$',
    '$ANGULAR_OUTPUT',
  ],
};

module.exports = config;

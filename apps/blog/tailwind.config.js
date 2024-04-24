const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        'al-black': {
          border: '#2E2F3B',
        },
        'al-gray': {
          100: '#6A798B',
          200: '#2E2F3B',
          300: '#23242E',
          400: '#16171D',
          500: '#14151B',
        },
        'al-blue': '#066aff',
        'al-pink': '#e70464',
      },
      backgroundImage: {
        'al-gradient-corner':
          'radial-gradient(58.54% 100% at 0% 100%, rgba(231, 4, 100, 0.2) 0%, rgba(20, 21, 27, 0.2) 100%)',
        'al-gradient-middle-bottom':
          'radial-gradient(74.37% 74.37% at 50% 124.47%, rgba(231, 4, 100, 0.6) 0%, rgba(35, 36, 46, 0) 100%)',
      },
      boxShadow: {
        'al-dark': 'inset -100px -200px 100px 100px #14151bd9',
      },
    },
  },
};

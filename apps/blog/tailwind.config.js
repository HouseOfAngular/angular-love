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
      },
      boxShadow: {
        'al-dark': 'inset -100px -200px 100px 100px #14151bd9',
      },
    },
  },
  plugins: [],
};

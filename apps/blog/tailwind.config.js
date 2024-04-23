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
          header: '#16171d',
          border: '#2e2f3b',
          text: '#6a798b',
          footer: '#23242e',
        },
        'al-pink': '#e70464',
      },
      boxShadow: {
        'al-dark': 'inset -100px -200px 100px 100px #14151bd9',
      },
    },
  },
  plugins: [],
};

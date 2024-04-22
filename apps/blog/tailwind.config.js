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
        'al-pink': '#e70464',
        'al-gray': {
          medium: '#23242E',
          header: '#16171d',
          border: '#2e2f3b',
          text: '#6a798b',
        },
      },
    },
  },
  plugins: [],
};

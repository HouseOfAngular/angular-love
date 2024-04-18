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
          header: '#16171d',
          border: '#2e2f3b',
          text: '#6a798b',
          background: '#14151b',
        },
        'al-blue': '#066aff',
      },
      backgroundImage: {
        'al-gradient':
          'radial-gradient(58.54% 100% at 0% 100%, rgba(231, 4, 100, 0.2) 0%, rgba(20, 21, 27, 0.2) 100%)',
      },
    },
  },
  plugins: [],
};

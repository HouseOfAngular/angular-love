module.exports = {
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
        'al-primary': 'var(--color-primary)',
      },
      backgroundImage: {
        'al-gradient':
          'radial-gradient(58.54% 100% at 0% 100%, rgba(231, 4, 100, 0.2) 0%, rgba(20, 21, 27, 0.2) 100%)',
      },
      boxShadow: {
        'al-dark': 'inset -100px -200px 100px 100px #14151bd9',
      },
    },
  },
};

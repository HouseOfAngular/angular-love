module.exports = {
  theme: {
    extend: {
      colors: {
        'al-gray': {
          100: '#6A798B',
          200: '#2E2F3B',
          300: '#23242E',
          400: '#16171D',
          500: '#14151bd9',
          600: '#14151B',
        },
        'al-blue': '#066aff',
        'al-pink': '#e70464',
        'al-primary': 'var(--color-primary)',
      },
      backgroundImage: {
        'al-gradient-red':
          'radial-gradient(58.54% 100% at 0% 100%, rgba(231, 4, 100, 0.2) 0%, rgba(20, 21, 27, 0.2) 100%)',
        'al-gradient-black':
          'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%)',
        'al-gradient-black-red':
          'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%), radial-gradient(74.37% 74.37% at 50% 124.47%, rgba(231, 4, 100, 0.6) 0%, rgba(35, 36, 46, 0) 100%);',
      },
      boxShadow: {
        'al-pink': '0 0 0 1px #e70464',
      },
    },
  },
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        'al-foreground': 'rgb(var(--foreground) / <alpha-value>)',
        'al-card': 'rgb(var(--card) / <alpha-value>)',
        'al-background': 'rgba(var(--background) / <alpha-value>)',
        'al-border': 'rgb(var(--border) / <alpha-value>)',
        'al-blue': '#066aff',
        'al-pink': 'rgba(var(--primary) / <alpha-value>)',
        'al-primary': 'rgba(var(--primary) / <alpha-value>)',
        'al-muted': 'rgba(var(--muted) / <alpha-value>)',
      },
      backgroundImage: {
        'al-radial-gradient':
          'radial-gradient(58.54% 100% at 0% 100%, rgba(var(--primary) / 0.2) 0%, transparent)',
        'al-background-gradient':
          'linear-gradient(180deg, rgba(var(--background) / 1) 0%, rgba(var(--background) / 0.6) 100%)',
        'al-bottom-radial-gradient':
          'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0) 100%), radial-gradient(74.37% 74.37% at 50% 124.47%, rgba(var(--primary) / 0.6) 0%, transparent 100%)',
      },
      boxShadow: {
        'al-primary': '0 0 0 1px rgba(var(--primary) / <alpha-value>)',
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries')],
};

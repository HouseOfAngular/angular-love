/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  theme: {
    extend: {
      translate: {
        '1.5x': '150%',
      },
      colors: {
        'al-foreground': 'rgb(var(--foreground) / <alpha-value>)',
        'al-primary-foreground':
          'rgb(var(--primary-foreground) / <alpha-value>)',
        'al-card': 'rgb(var(--card) / <alpha-value>)',
        'al-background': 'rgba(var(--background) / <alpha-value>)',
        'al-border': 'rgb(var(--border) / <alpha-value>)',
        'al-blue': '#066aff',
        'al-pink': 'rgba(var(--primary) / <alpha-value>)',
        'al-primary': 'rgba(var(--primary) / <alpha-value>)',
        'al-muted': 'rgba(var(--muted) / <alpha-value>)',
        'al-roadmap-primary': 'rgba(var(--roadmap-primary) / <alpha-value>)',
        'al-roadmap-secondary':
          'rgba(var(--roadmap-secondary) / <alpha-value>)',
        'al-roadmap-accent': 'rgba(var(--roadmap-accent) / <alpha-value>)',
        'al-roadmap-hover-primary':
          'rgba(var(--roadmap-hover-primary) / <alpha-value>)',
        'al-roadmap-hover-secondary':
          'rgba(var(--roadmap-hover-secondary) / <alpha-value>)',
        'al-roadmap-label-optional':
          'rgba(var(--roadmap-label-optional) / <alpha-value>)',
        'al-roadmap-label-comingSoon':
          'rgba(var(--roadmap-label-comingSoon) / <alpha-value>)',
        'al-grey': 'rgba(var(--grey) / <alpha-value>)',
        'al-footer-background':
          'rgba(var(--footer-background) / <alpha-value>)',
      },
      backgroundImage: {
        'al-radial-gradient':
          'radial-gradient(58.54% 100% at 0% 100%, rgba(var(--primary) / 0.2) 0%, transparent)',
        'al-roadmap-gradient':
          'radial-gradient(58.54% 100% at 0% 100%, #E8A4B8, #FDEBF0 100%)',
        'al-background-gradient':
          'linear-gradient(180deg, rgba(var(--background) / 1) 0%, rgba(var(--background) / 0.6) 100%)',
        'al-bottom-radial-gradient':
          'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0) 100%), radial-gradient(74.37% 74.37% at 50% 124.47%, rgba(var(--primary) / 0.6) 0%, transparent 100%)',
      },
      boxShadow: {
        'al-primary': '0 0 0 1px rgba(var(--primary) / <alpha-value>)',
        'al-full-background': '0px 0px 0px 999px rgba(var(--background) / 1)',
        'al-full-border': '0px 0px 0px 999px rgba(var(--grey) / 1)',
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant(
        'light',
        '&:where([data-theme="light"], [data-theme="light"] *)',
      );
      addVariant('dark', '&:where([data-theme="dark"], [data-theme="dark"] *)');
    },
  ],
};

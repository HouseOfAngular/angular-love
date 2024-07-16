import type { CookieConsentConfig } from 'vanilla-cookieconsent';

declare global {
  interface Window {
    dataLayer: {
      push: (...args: any[]) => void;
    };
  }
}

export const cookieConsentConfig = {
  categories: {
    necessary: {
      enabled: true,
      readOnly: true,
    },
    analytics: {
      enabled: false,
      readOnly: false,
    },
    marketing: {
      enabled: false,
      readOnly: false,
    },
    ads: {},
  },
  onConsent: () => {
    window.dataLayer.push({ event: 'consent_update' });
    window.dispatchEvent(new CustomEvent('ptupdate'));
  },
  onChange: () => {
    window.dataLayer.push({ event: 'consent_update_change' });
    window.dispatchEvent(new CustomEvent('ptupdate'));
  },
  onFirstConsent: () => {
    window.dataLayer.push({ event: 'consent_update_first' });
    window.dispatchEvent(new CustomEvent('ptupdate'));
  },
  language: {
    default: 'en',
    autoDetect: 'browser',
    translations: {
      en: {
        consentModal: {
          title: 'We use cookies',
          description:
            'We use cookies to enhance your experience on our website. You can manage your preferences below.',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          showPreferencesBtn: 'Manage Individual preferences',
        },
        preferencesModal: {
          title: 'Manage cookie preferences',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          savePreferencesBtn: 'Accept current selection',
          closeIconLabel: 'Close modal',
          sections: [
            {
              title: 'Somebody said ... cookies?',
              description:
                'We use cookies to enhance your experience on our website. Some cookies are necessary for the website to function properly, while others help us improve your experience by providing insights into how the site is being used.',
            },
            {
              title: 'Strictly Necessary Cookies',
              description:
                'These cookies are essential for the proper functioning of the website and cannot be disabled.',
              linkedCategory: 'necessary',
            },
            {
              title: 'Performance and Analytics',
              description:
                'These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you. They help us understand how visitors interact with our site, which allows us to improve our content and user experience.',
              linkedCategory: 'analytics',
            },
            {
              title: 'Marketing',
              description:
                'These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third party advertisers.',
              linkedCategory: 'marketing',
            },
            {
              title: 'More Information',
              description:
                'For any queries in relation to our policy on cookies and your choices, please reach out to us.',
            },
          ],
        },
      },
    },
  },
} satisfies CookieConsentConfig;

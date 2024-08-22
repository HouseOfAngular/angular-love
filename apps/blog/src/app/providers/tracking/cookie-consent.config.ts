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
  cookie: {
    name: 'cc_cookie_al',
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
            'Hello, Angular Enthusiast! We use cookies on our website to provide content that best suits your interests and brings you the most value. By accepting all cookies, you allow us to learn more about the topics you prefer, enabling us to tailor our content to your needs. Thank you for joining us and helping to grow the Angular community.<br><br>You can also manage your preferences below.',
          acceptAllBtn: 'Accept all',
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
                'Hello, Angular Enthusiast! We use cookies on our website to provide content that best suits your interests and brings you the most value. By accepting all cookies, you allow us to learn more about the topics you prefer, enabling us to tailor our content to your needs. Thank you for joining us and helping to grow the Angular community.<br><br>You can also manage your preferences below.',
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
      pl: {
        consentModal: {
          title: 'Używamy plików cookie',
          description:
            'Używamy plików cookie na naszej stronie, aby dostarczać treści, które najlepiej odpowiadają Twoim zainteresowaniom i przynoszą Ci najwięcej korzyści. Akceptując wszystkie pliki cookie, pozwalasz nam lepiej poznać tematy, które Cię interesują, co umożliwia nam dostosowanie treści do Twoich potrzeb. Dziękujemy za dołączenie do nas i pomoc w rozwoju społeczności Angulara.<br><br>Możesz także zarządzać swoimi preferencjami poniżej.',
          acceptAllBtn: 'Zaakceptuj wszystkie',
          showPreferencesBtn: 'Zarządzaj indywidualnymi preferencjami',
        },
        preferencesModal: {
          title: 'Zarządzaj preferencjami plików cookie',
          acceptAllBtn: 'Zaakceptuj wszystkie',
          acceptNecessaryBtn: 'Odrzuc wszystkie',
          savePreferencesBtn: 'Zaakceptuj wybrane',
          closeIconLabel: 'Zamknij zaawansowane ustawienia',
          sections: [
            {
              title: 'Czy ktoś powiedział... ciasteczka?',
              description:
                'Używamy plików cookie na naszej stronie, aby dostarczać treści, które najlepiej odpowiadają Twoim zainteresowaniom i przynoszą Ci najwięcej korzyści. Akceptując wszystkie pliki cookie, pozwalasz nam lepiej poznać tematy, które Cię interesują, co umożliwia nam dostosowanie treści do Twoich potrzeb. Dziękujemy za dołączenie do nas i pomoc w rozwoju społeczności Angulara.<br><br>Możesz także zarządzać swoimi preferencjami poniżej.',
            },
            {
              title: 'Niezbędne pliki cookie',
              description:
                'Te pliki cookie są niezbędne do prawidłowego funkcjonowania strony i nie można ich wyłączyć.',
              linkedCategory: 'necessary',
            },
            {
              title: 'Wydajność i analityka',
              description:
                'Te pliki cookie zbierają informacje o tym, w jaki sposób korzystasz z naszej witryny. Wszystkie dane są anonimowe i nie pozwalają na identyfikację użytkownika. Pomagają nam zrozumieć, w jaki sposób odwiedzający wchodzą w interakcję z naszą witryną, co pozwala nam ulepszać nasz kontent i wygodę użytkownika.',
              linkedCategory: 'analytics',
            },
            {
              title: 'Marketing',
              description:
                'Te pliki cookie służą do śledzenia osób odwiedzających strony internetowe. Celem jest wyświetlanie spersonalizowanych reklam, a tym samym bardziej wartościowych dla wydawców i zewnętrznych reklamodawców.',
              linkedCategory: 'marketing',
            },
            {
              title: 'Więcej informacji',
              description:
                'W przypadku jakichkolwiek pytań związanych z naszą polityką dotyczącą plików cookie i Twoimi wyborami, skontaktuj się z nami.',
            },
          ],
        },
      },
    },
  },
  guiOptions: {
    consentModal: {
      layout: 'bar',
      position: 'bottom',
    },
  },
  disablePageInteraction: true,
} satisfies CookieConsentConfig;

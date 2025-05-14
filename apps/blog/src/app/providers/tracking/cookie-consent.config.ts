import {
  CATEGORIES,
  CreateCookieConsentConfigFn,
  SERVICES,
  updateGtagConsent,
} from '@angular-love/blog/tracking/feature';

export const cookieConsentConfig: CreateCookieConsentConfigFn = (cc) => {
  return {
    categories: {
      [CATEGORIES.NECESSARY]: {
        enabled: true,
        readOnly: true,
      },
      [CATEGORIES.ANALYTICS]: {
        autoClear: {
          cookies: [
            {
              name: /^_ga/,
            },
            {
              name: '_gid',
            },
          ],
        },
        services: {
          [SERVICES.ANALYTICS_STORAGE]: {
            label:
              'Enables storage (such as cookies) related to analytics e.g. visit duration.',
          },
        },
      },
      [CATEGORIES.ADVERTISEMENT]: {
        services: {
          [SERVICES.AD_STORAGE]: {
            label: 'Enables storage (such as cookies) related to advertising.',
          },
          [SERVICES.AD_USER_DATA]: {
            label:
              'Sets consent for sending user data related to advertising to Google.',
          },
          [SERVICES.AD_PERSONALIZATION]: {
            label: 'Sets consent for personalized advertising.',
          },
        },
      },
      [CATEGORIES.FUNCTIONALITY]: {
        services: {
          [SERVICES.FUNCTIONALITY_STORAGE]: {
            label:
              'Enables storage that supports the functionality of the website or app e.g. language settings.',
          },
          [SERVICES.PERSONALIZATION_STORAGE]: {
            label:
              'Enables storage related to personalization e.g. video recommendations.',
          },
        },
      },
      [CATEGORIES.SECURITY]: {
        services: {
          [SERVICES.SECURITY_STORAGE]: {
            label:
              'Enables storage related to security such as authentication functionality, fraud prevention, and other user protection.',
          },
        },
      },
    },
    cookie: {
      name: 'cc_cookie_al',
    },
    onModalShow: () => {
      const ccEl = document.getElementById('cc-main');
      // Check if the cookie consent dialog has been hidden by injected styles from an external extension (e.g., "I don't care about cookies").
      // To respect this and avoid issues with the `disablePageInteraction` flag, we manually remove the overlay that blocks page interaction.
      if (ccEl && window.getComputedStyle(ccEl).display === 'none') {
        // Reference: https://github.com/orestbida/cookieconsent/blob/e6279509aab5b96be198297b0283b321ad76b0a9/src/utils/constants.js#L8C50-L8C70
        document.documentElement.classList.remove('disable--interaction');
      }
    },
    onFirstConsent: () => {
      updateGtagConsent(cc);
    },
    onConsent: () => {
      updateGtagConsent(cc);
      cc.loadScript('/assets/scripts/gtm.js');
    },
    onChange: () => {
      updateGtagConsent(cc);
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
                title: 'Performance and Analytics Cookies',
                description:
                  'These cookies collect information about how you use our website. All data is anonymized and cannot be used to identify you. They help us understand how visitors interact with our site, which allows us to improve our content and user experience.',
                linkedCategory: 'analytics',
              },
              {
                title: 'Advertisement Cookies',
                description:
                  'These cookies are used for advertising purposes, including storing ad-related data, sending user data for advertising, and personalizing ads.',
                linkedCategory: 'advertisement',
              },
              {
                title: 'Functionality Cookies',
                description:
                  'These cookies enable enhanced functionality and personalization, such as remembering your preferences and language settings.',
                linkedCategory: 'functionality',
              },
              {
                title: 'Security Cookies',
                description:
                  'These cookies help protect your data, authenticate your session, and prevent fraud.',
                linkedCategory: 'security',
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
                  'Te pliki cookie zbierają informacje o tym, w jaki sposób korzystasz z naszej witryny. Wszystkie dane są anonimowe i nie pozwalają na identyfikację użytkownika. Pomagają nam zrozumieć, jak użytkownicy korzystają z naszej strony, co pozwala nam ulepszać treści oraz wygodę użytkowania.',
                linkedCategory: 'analytics',
              },
              {
                title: 'Pliki cookie reklamowe',
                description:
                  'Te pliki cookie są używane w celach reklamowych, w tym do przechowywania danych związanych z reklamami, przesyłania danych użytkownika do celów reklamowych oraz personalizacji reklam.',
                linkedCategory: 'advertisement',
              },
              {
                title: 'Pliki cookie funkcjonalne',
                description:
                  'Te pliki cookie umożliwiają korzystanie z rozszerzonych funkcji strony lub aplikacji, takich jak zapamiętywanie ustawień języka czy preferencji użytkownika.',
                linkedCategory: 'functionality',
              },
              {
                title: 'Pliki cookie bezpieczeństwa',
                description:
                  'Te pliki cookie pomagają chronić Twoje dane, uwierzytelniać sesję i zapobiegać oszustwom.',
                linkedCategory: 'security',
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
  };
};

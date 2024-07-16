import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import {
  consent,
  gtag,
  gtmScript,
  provideTracking,
} from '@angular-love/blog/tracking/feature';

import { cookieConsentConfig } from './cookie-consent.config';

export const provideAppTracking = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideTracking({
      partyTown: {
        partyTown: {
          forward: [
            ['dataLayer.push', { preserveBehavior: true }],
            ['fbq', { preserveBehavior: true }],
          ],
          enabled: true,
          reverseProxy: 'https://reverse.contact-ef8.workers.dev/',
          proxiedHosts: [
            'region1.analytics.google.com',
            'www.google-analytics.com',
            'www.googletagmanager.com',
            'googletagmanager.com',
            'connect.facebook.net',
            'googleads.g.doubleclick.net',
            'snap.licdn.com',
            'static.ads-twitter.com',
          ],
        },
        scripts: [
          gtag(),
          gtmScript('GTM-5XNT5NS'),
          consent('ads', 'ad_storage', 'granted'),
          consent('ads', 'ad_storage', 'denied'),
          consent('analytics', 'analytics_storage', 'granted'),
          consent('analytics', 'analytics_storage', 'denied'),
        ],
      },
      cookieConsent: cookieConsentConfig,
    }),
  ]);
};

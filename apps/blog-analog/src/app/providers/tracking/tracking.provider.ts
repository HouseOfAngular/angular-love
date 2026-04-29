import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import {
  metaPixel,
  metaScript,
  provideTracking,
} from '@angular-love/blog/tracking/feature';

import { cookieConsentConfig } from './cookie-consent.config';

export const provideAppTracking = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideTracking({
      partyTown: {
        forward: [
          ['dataLayer.push', { preserveBehavior: true }],
          ['fbq', { preserveBehavior: true }],
        ],
        enabled: false,
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
      cookieConsent: cookieConsentConfig,
      scripts: [metaScript('284876369340184')],
      pixels: [metaPixel('284876369340184')],
    }),
  ]);
};

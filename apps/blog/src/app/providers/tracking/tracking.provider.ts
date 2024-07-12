import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import {
  gtmScript,
  metaPixel,
  metaScript,
  provideTracking,
} from '@angular-love/blog/tracking/feature';

import { cookieConsentConfig } from './cookie-consent.config';

export const provideAppTracking = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideTracking({
      partyTown: {
        partyTown: {
          enabled: true,
          reverseProxy: 'https://reverse.contact-ef8.workers.dev/',
          proxiedHosts: [
            'region1.analytics.google.com',
            'www.google-analytics.com',
            'googletagmanager.com',
            'connect.facebook.net',
            'googleads.g.doubleclick.net',
            'snap.licdn.com',
            'static.ads-twitter.com',
          ],
        },
        scripts: [gtmScript('GTM-5XNT5NS'), metaScript('284876369340184')],
        pixels: [metaPixel('284876369340184')],
      },
      cookieConsent: cookieConsentConfig,
    }),
  ]);
};

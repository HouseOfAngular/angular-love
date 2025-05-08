import { isPlatformBrowser } from '@angular/common';
import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  PLATFORM_ID,
  provideAppInitializer,
} from '@angular/core';

import { CreateCookieConsentConfigFn } from './cookie-consent';
import { provideCookieConsent } from './cookie-consent/cookie-consent.provider';
import {
  PartyTownConfig,
  PartyTownService,
  providePartyTown,
} from './partytown';
import { defaultGtagConsent } from './scripts';
import { PixelFactory, ScriptFactory, ScriptsLoader } from './scripts-loader';
import { ScriptsLoaderService } from './scripts-loader.service';

export type TrackingConfig = {
  partyTown: PartyTownConfig;
  cookieConsent: CreateCookieConsentConfigFn;
  scripts?: ScriptFactory[];
  pixels?: PixelFactory[];
};

export const provideTracking = (
  config: TrackingConfig,
): EnvironmentProviders => {
  return makeEnvironmentProviders([
    ...(config.partyTown?.enabled
      ? [
          providePartyTown(config.partyTown),
          {
            provide: ScriptsLoader,
            useClass: PartyTownService,
          },
        ]
      : [
          ScriptsLoaderService,
          {
            provide: ScriptsLoader,
            useClass: ScriptsLoaderService,
          },
        ]),
    provideCookieConsent(config.cookieConsent),
    provideAppInitializer(() => {
      const initializerFn = (() => {
        const platformId = inject(PLATFORM_ID);
        const scriptsLoader = inject(ScriptsLoader);

        return () => {
          if (isPlatformBrowser(platformId)) {
            window.dataLayer = window.dataLayer || [];
            window.gtag = function gtag() {
              // eslint-disable-next-line prefer-rest-params
              dataLayer.push(arguments);
            };
            defaultGtagConsent();
            scriptsLoader.init(config.scripts ?? [], config.pixels ?? []);
          }
        };
      })();
      return initializerFn();
    }),
  ]);
};

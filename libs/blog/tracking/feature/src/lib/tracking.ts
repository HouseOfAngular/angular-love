import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import type { CookieConsentConfig } from 'vanilla-cookieconsent';

import { provideCookieConsent } from './cookie-consent/cookie-consent.provider';
import { PartyTownConfig, providePartyTown } from './partytown';

export type TrackingConfig = {
  partyTown: PartyTownConfig;
  cookieConsent: CookieConsentConfig;
};

export const provideTracking = (
  config: TrackingConfig,
): EnvironmentProviders => {
  return makeEnvironmentProviders([
    providePartyTown(config.partyTown),
    provideCookieConsent(config.cookieConsent),
  ]);
};

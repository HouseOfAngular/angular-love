import type * as CookieConsent from 'vanilla-cookieconsent';

export type CreateCookieConsentConfigFn = (
  cc: typeof CookieConsent,
) => CookieConsent.CookieConsentConfig;

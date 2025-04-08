import type * as CookieConsent from 'vanilla-cookieconsent';

import { CATEGORIES, SERVICES } from '../const';
import { ScriptFactory } from '../scripts-loader';

export const gtmScript =
  (id: string): ScriptFactory =>
  (gtmScript) => {
    gtmScript.setAttribute('type', 'text/plain');
    gtmScript.setAttribute('data-category', 'necessary');
    gtmScript.textContent = `(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
  var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
  j.defer = true;
  j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', '${id}');`;
    return gtmScript;
  };

type PushFn = (...args: any[]) => void;
type DataLayer = {
  push: PushFn;
};

declare global {
  let dataLayer: DataLayer;
  let gtag: PushFn;

  interface Window {
    dataLayer: DataLayer;
    gtag: PushFn;
  }
}

export function defaultGtagConsent(): void {
  gtag('consent', 'default', {
    [SERVICES.AD_STORAGE]: 'denied',
    [SERVICES.AD_USER_DATA]: 'denied',
    [SERVICES.AD_PERSONALIZATION]: 'denied',
    [SERVICES.ANALYTICS_STORAGE]: 'denied',
    [SERVICES.FUNCTIONALITY_STORAGE]: 'denied',
    [SERVICES.PERSONALIZATION_STORAGE]: 'denied',
    [SERVICES.SECURITY_STORAGE]: 'denied',
  });
}

export function updateGtagConsent(cc: typeof CookieConsent): void {
  gtag('consent', 'update', {
    [SERVICES.ANALYTICS_STORAGE]: cc.acceptedService(
      SERVICES.ANALYTICS_STORAGE,
      CATEGORIES.ANALYTICS,
    )
      ? 'granted'
      : 'denied',
    [SERVICES.AD_STORAGE]: cc.acceptedService(
      SERVICES.AD_STORAGE,
      CATEGORIES.ADVERTISEMENT,
    )
      ? 'granted'
      : 'denied',
    [SERVICES.AD_USER_DATA]: cc.acceptedService(
      SERVICES.AD_USER_DATA,
      CATEGORIES.ADVERTISEMENT,
    )
      ? 'granted'
      : 'denied',
    [SERVICES.AD_PERSONALIZATION]: cc.acceptedService(
      SERVICES.AD_PERSONALIZATION,
      CATEGORIES.ADVERTISEMENT,
    )
      ? 'granted'
      : 'denied',
    [SERVICES.FUNCTIONALITY_STORAGE]: cc.acceptedService(
      SERVICES.FUNCTIONALITY_STORAGE,
      CATEGORIES.FUNCTIONALITY,
    )
      ? 'granted'
      : 'denied',
    [SERVICES.PERSONALIZATION_STORAGE]: cc.acceptedService(
      SERVICES.PERSONALIZATION_STORAGE,
      CATEGORIES.FUNCTIONALITY,
    )
      ? 'granted'
      : 'denied',
    [SERVICES.SECURITY_STORAGE]: cc.acceptedService(
      SERVICES.SECURITY_STORAGE,
      CATEGORIES.SECURITY,
    )
      ? 'granted'
      : 'denied',
  });
}

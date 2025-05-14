import { Injectable } from '@angular/core';
import { defer, Observable, shareReplay } from 'rxjs';
import type * as CookieConsent from 'vanilla-cookieconsent';

@Injectable()
export class CookieConsentService {
  private readonly _cookieConsent$ = defer(
    () => import('vanilla-cookieconsent'),
  ).pipe(shareReplay({ bufferSize: 1, refCount: true }));

  get cookieConsent(): Observable<typeof CookieConsent> {
    return this._cookieConsent$;
  }
}

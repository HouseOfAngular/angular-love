import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Observable } from 'rxjs';

@Injectable()
export class I18nHeadersInterceptor implements HttpInterceptor {
  readonly translocoService = inject(TranslocoService);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const LANG = this.translocoService.getActiveLang();
    const modifiedRequest = request.clone({
      headers: request.headers.set('x-al-lang', LANG),
    });
    return next.handle(modifiedRequest);
  }
}

export const i18nHeadersInterceptor: HttpInterceptorFn = (request, next) => {
  const translocoService = inject(TranslocoService);
  const LANG = translocoService.getActiveLang();

  const modifiedRequest = request.clone({
    headers: request.headers.set('x-al-lang', LANG),
  });

  return next(modifiedRequest);
};

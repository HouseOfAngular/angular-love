import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
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
      setHeaders: {
        LANG,
      },
    });
    return next.handle(modifiedRequest);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ConfigService } from '@angular-love/shared/config';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  private readonly _http = inject(HttpClient);
  private readonly _apiBaseUrl = inject(ConfigService).get('apiBaseUrl');

  subscribe(email: string): Observable<string> {
    return this._http.post<string>(
      `${this._apiBaseUrl}/newsletter/subscribe`,
      email,
    );
  }
}

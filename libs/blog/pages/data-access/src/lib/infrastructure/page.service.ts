import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Page } from '@angular-love/blog/contracts/pages';
import { ConfigService } from '@angular-love/shared/config';

@Injectable({ providedIn: 'root' })
export class PageService {
  private readonly _apiBaseUrl = inject(ConfigService).get('apiBaseUrl');
  private readonly _http = inject(HttpClient);

  getPage(slug: string): Observable<Page> {
    return this._http.get<Page>(`${this._apiBaseUrl}/pages/${slug}`);
  }
}

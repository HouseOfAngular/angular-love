import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Author } from '@angular-love/blog/contracts/authors';
import { ConfigService } from '@angular-love/shared/config';

@Injectable({ providedIn: 'root' })
export class AuthorService {
  private readonly _apiBaseUrl = inject(ConfigService).get('apiBaseUrl');
  private readonly _http = inject(HttpClient);

  getAuthor(id: string): Observable<Author> {
    return this._http.get<Author>(`${this._apiBaseUrl}/authors/${id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ArrayResponse } from '@angular-love/blog-contracts/shared';
import { Author } from '@angular-love/blog/contracts/authors';
import { ConfigService } from '@angular-love/shared/config';

import { AuthorsQuery } from '../dto/authors.query';

@Injectable({ providedIn: 'root' })
export class AuthorService {
  private readonly _apiBaseUrl = inject(ConfigService).get('apiBaseUrl');
  private readonly _http = inject(HttpClient);

  getAuthor(slug: string): Observable<Author> {
    return this._http.get<Author>(`${this._apiBaseUrl}/authors/${slug}`);
  }

  getAuthorsList(query: AuthorsQuery): Observable<ArrayResponse<Author>> {
    return this._http.get<ArrayResponse<Author>>(
      `${this._apiBaseUrl}/authors`,
      {
        params: query || {},
      },
    );
  }
}

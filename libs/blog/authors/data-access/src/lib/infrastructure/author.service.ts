import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ArrayResponse } from '@angular-love/blog-contracts/shared';
import { Author } from '@angular-love/blog/contracts/authors';
import { ArticlePreview } from '@angular-love/contracts/articles';
import { ConfigService } from '@angular-love/shared/config';

import { AuthorsQuery } from '../dto/authors.query';

@Injectable({ providedIn: 'root' })
export class AuthorService {
  private readonly _apiBaseUrl = inject(ConfigService).get('apiV2BaseUrl');
  private readonly _http = inject(HttpClient);

  getAuthor(slug: string): Observable<Author> {
    return this._http.get<Author>(`${this._apiBaseUrl}/authors/${slug}`);
  }

  getAuthorArticles(
    slug: string,
    query: {
      take?: number;
      skip?: number;
    },
  ): Observable<ArrayResponse<ArticlePreview>> {
    return this._http.get<ArrayResponse<ArticlePreview>>(
      `${this._apiBaseUrl}/authors/${slug}/articles`,
      {
        params: query || {},
      },
    );
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

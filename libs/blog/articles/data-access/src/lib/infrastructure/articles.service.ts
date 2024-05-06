import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ArrayResponse,
  Article,
  ArticlePreview,
} from '@angular-love/contracts/articles';
import { ConfigService } from '@angular-love/shared/config';

import { ArticlesQuery } from '../dto/articles.query';

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  private readonly _apiBaseUrl = inject(ConfigService).get('apiBaseUrl');
  private readonly _http = inject(HttpClient);

  getArticleBySlug(slug: string): Observable<Article> {
    return this._http.get<Article>(`${this._apiBaseUrl}/articles/${slug}`);
  }

  getArticleList(
    query: ArticlesQuery,
  ): Observable<ArrayResponse<ArticlePreview>> {
    return this._http.get<ArrayResponse<ArticlePreview>>(
      `${this._apiBaseUrl}/articles`,
      {
        params: query ?? {},
      },
    );
  }
}

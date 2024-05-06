import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Article, ArticlePreview } from '@angular-love/contracts/articles';
import { ConfigService } from '@angular-love/shared/config';

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  private readonly _apiBaseUrl = inject(ConfigService).get('apiBaseUrl');
  private readonly _http = inject(HttpClient);

  getArticleBySlug(slug: string): Observable<Article> {
    return this._http.get<Article>(`${this._apiBaseUrl}/articles/${slug}`);
  }

  getArticleList(_data: {
    query: string | null;
  }): Observable<ArticlePreview[]> {
    return this._http.get<ArticlePreview[]>(
      `${this._apiBaseUrl}/articles?query=${_data.query}`,
    );
  }
}

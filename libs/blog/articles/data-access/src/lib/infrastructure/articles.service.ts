import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '@angular-love/shared/config';
import { HttpClient } from '@angular/common/http';
import { Article, ArticlePreview } from '../contract/article';

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
      `${this._apiBaseUrl}/articles?query=${_data.query}`
    );
  }
}

import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticlePreview } from './article';
import { ConfigService } from '@angular-love/shared/config';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  private readonly _apiBaseUrl = inject(ConfigService).get('apiBaseUrl');
  private readonly _http = inject(HttpClient);

  getArticlesList(): Observable<ArticlePreview[]> {
    return this._http.get<ArticlePreview[]>(`${this._apiBaseUrl}/articles`);
  }

  getArticleBySlug(slug: string): Observable<ArticlePreview> {
    return this._http.get<ArticlePreview>(
      `${this._apiBaseUrl}/articles/${slug}`
    );
  }

  searchArticles(query: string): Observable<ArticlePreview[]> {
    return this._http.get<ArticlePreview[]>(
      `${this._apiBaseUrl}/articles/search?q=${query}`
    );
  }
}

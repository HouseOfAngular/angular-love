import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article } from './article';
import { ConfigService } from '@angular-love/shared/config';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ArticlesService {
  private readonly _apiBaseUrl = inject(ConfigService).get('apiBaseUrl');
  private readonly _http = inject(HttpClient);

  getArticlesList(): Observable<Article[]> {
    return this._http.get<Article[]>(`${this._apiBaseUrl}/articles`);
  }
}

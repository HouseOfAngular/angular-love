import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from './article';

@Injectable()
export class ArticlesService {
  private readonly _http = inject(HttpClient);

  getArticlesList(limit: number): Observable<Article[]> {
    const params = new URLSearchParams();
    params.append('_fields[]', 'slug');
    params.append('_fields[]', 'title');
    params.append('per_page', limit.toString());
    return this._http.get<Article[]>(
      `https://angular.love/wp-json/wp/v2/posts?${params.toString()}`
    );
  }
}

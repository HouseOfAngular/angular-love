import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, finalize } from 'rxjs';
import { ArticlePreview } from './article';
import { ConfigService } from '@angular-love/shared/config';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ArticleListService {
  private readonly _apiBaseUrl = inject(ConfigService).get('apiBaseUrl');
  private readonly _http = inject(HttpClient);
  private readonly _articlesListLoadingSubject = new BehaviorSubject(false);
  private readonly _articlesListDataSubject = new BehaviorSubject<
    ArticlePreview[] | null
  >(null);

  readonly articlesListLoading$ =
    this._articlesListLoadingSubject.asObservable();
  readonly articlesListData$ = this._articlesListDataSubject.asObservable();

  fetchArticles(): void {
    this._articlesListLoadingSubject.next(true);
    this._articlesListDataSubject.next(null);
    this._http
      .get<ArticlePreview[]>(`${this._apiBaseUrl}/articles`)
      .pipe(
        finalize(() => {
          this._articlesListLoadingSubject.next(false);
        })
      )
      .subscribe({
        next: (articles) => this._articlesListDataSubject.next(articles),
        error: (error) => this._articlesListDataSubject.error(error),
      });
  }
}

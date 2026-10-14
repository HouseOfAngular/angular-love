import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AiNewsFeedQuery,
  AiNewsFeedResponse,
  AiNewsItemDetail,
} from '@angular-love/blog/contracts/ai-news';
import { ConfigService } from '@angular-love/shared/config';

@Injectable({ providedIn: 'root' })
export class AiNewsService {
  private readonly _apiBaseUrl = inject(ConfigService).get('apiBaseUrl');
  private readonly _http = inject(HttpClient);

  getFeed(query: AiNewsFeedQuery): Observable<AiNewsFeedResponse> {
    const params: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        params[key] = value;
      }
    }
    return this._http.get<AiNewsFeedResponse>(`${this._apiBaseUrl}/ai-news`, {
      params,
    });
  }

  getItem(slug: string): Observable<AiNewsItemDetail> {
    return this._http.get<AiNewsItemDetail>(
      `${this._apiBaseUrl}/ai-news/${encodeURIComponent(slug)}`,
    );
  }
}

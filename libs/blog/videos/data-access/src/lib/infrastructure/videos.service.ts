import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ArrayResponse } from '@angular-love/blog-contracts/shared';
import { VideoPreview } from '@angular-love/blog/contracts/videos';
import { ConfigService } from '@angular-love/shared/config';

import { VideosQuery } from '../dto/videos.query';

@Injectable({ providedIn: 'root' })
export class VideosService {
  private readonly _apiBaseUrl = inject(ConfigService).get('apiBaseUrl');
  private readonly _http = inject(HttpClient);

  getVideosList(query: VideosQuery): Observable<ArrayResponse<VideoPreview>> {
    return this._http.get<ArrayResponse<VideoPreview>>(
      `${this._apiBaseUrl}/videos`,
      { params: query || {} },
    );
  }
}

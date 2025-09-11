import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ArrayResponse } from '@angular-love/blog-contracts/shared';
import { VideoPreview } from '@angular-love/blog/contracts/videos';
import { ConfigService } from '@angular-love/shared/config';

import { VideosQuery } from '../dto/videos.query';

@Injectable({ providedIn: 'root' })
export class VideosService {
  private readonly _apiBaseUrl = inject(ConfigService).get('apiBaseUrl');
  private readonly _http = inject(HttpClient);

  getVideosList(query: VideosQuery): Observable<ArrayResponse<VideoPreview>> {
    return of({
      data: [
        {
          videoId: 'PAXESli1Ztw',
          title:
            'Lazy, but Fast: How Taking It Slow Can Speed Up Your App! - Jarosław Żołnowski, GDE',
          eventName: 'Angular Spring Camp 2025',
        },
        {
          videoId: 'fskxz4sZB_w',
          title:
            'Case Study - Building an Accessible Product Variant Selector - Damian Maduzia',
          eventName: 'Angular Spring Camp 2025',
        },
        {
          videoId: 't0WvhimkM7Q',
          title:
            'The Role of Renderer2 in Modern Angular - Dmytro Mezhenskyi, Google Developer Expert',
          eventName: 'Angular Spring Camp 2025',
        },
      ],
      total: 2,
    });
    // TODO - add real API
    // return this._http.get<ArrayResponse<VideoPreview>>(
    //   `${this._apiBaseUrl}/videos`,
    //   { params: query || {} },
    // );
  }
}

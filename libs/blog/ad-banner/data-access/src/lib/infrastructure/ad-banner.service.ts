import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Banners } from '@angular-love/blog/contracts/banners';
import { ConfigService } from '@angular-love/shared/config';

@Injectable({ providedIn: 'root' })
export class AdBannerService {
  private readonly _apiBaseUrl = inject(ConfigService).get('apiBaseUrl');
  private readonly _http = inject(HttpClient);

  getVisibleBanners() {
    return this._http.get<Banners>(`${this._apiBaseUrl}/banners`);
  }
}

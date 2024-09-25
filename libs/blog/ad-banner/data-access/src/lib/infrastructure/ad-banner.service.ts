import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Slider } from '@angular-love/blog/contracts/banners';
import { ConfigService } from '@angular-love/shared/config';

@Injectable({ providedIn: 'root' })
export class AdBannerService {
  private readonly _apiBaseUrl = inject(ConfigService).get('apiBaseUrl');
  private readonly _http = inject(HttpClient);

  getBannerSlider() {
    return this._http.get<Slider>(`${this._apiBaseUrl}/banners`);
  }
}

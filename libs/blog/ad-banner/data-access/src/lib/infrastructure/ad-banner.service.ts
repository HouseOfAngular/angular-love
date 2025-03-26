import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

import { Slider } from '@angular-love/blog/contracts/banners';

@Injectable({ providedIn: 'root' })
export class AdBannerService {
  private readonly _http = inject(HttpClient);

  getBannerSlider() {
    return this._http
      .get<{ banners: Slider }>(`./assets/banners.json`)
      .pipe(map((resp) => resp.banners));
  }
}

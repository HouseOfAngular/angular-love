import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AdBanner } from '@angular-love/blog/shared/ad-banner';

@Injectable({ providedIn: 'root' })
export class AdBannerService {
  // @todo extend when BFF is ready
  getData(): Observable<AdBanner> {
    return of({
      title: 'FREE EBOOK: The Ultimate Guide to Angular Evolution',
      title_mobile: 'Free ebook',
      description: `Discover How Angular 18 Improves Efficiency, DX, UX, and Performance`,
      description_mobile: 'Angular Evolution',
      additional_info: 'Angular 18',
      href: 'https://houseofangular.io/the-ultimate-guide-to-angular-evolution/?utm_source=angular.love&utm_medium=baner&utm_campaign=angular-evolution24',
    });
  }
}

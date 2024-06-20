import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AdBanner } from '@angular-love/blog/shared/ad-banner';

@Injectable({ providedIn: 'root' })
export class AdBannerService {
  // @todo extend when BFF is ready
  getData(): Observable<AdBanner> {
    return of({
      title: 'Angular Meetup',
      number: 12,
      description: `Learn how to use Angular's defer block to improve perfomance`,
      date: '1 September',
      time: '6pm CET',
      location: 'Warsaw & Online',
      href: 'https://google.com',
    });
  }
}

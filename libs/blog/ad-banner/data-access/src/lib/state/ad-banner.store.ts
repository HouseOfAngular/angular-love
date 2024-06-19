import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { switchMap } from 'rxjs';

import { AdBanner } from '@angular-love/blog/shared/ad-banner';

import { AdBannerService } from '../infrastructure/ad-banner.service';

// @todo extend this type when BFF is ready
type AdBannerState = {
  adBannerVisible: boolean;
  adBanner: AdBanner;
};

// @todo remove hardcoded adBanner state when BFF is ready
const initialState: AdBannerState = {
  adBannerVisible: true,
  adBanner: {
    title: 'Angular Meetup',
    number: 12,
    description: `Learn how to use Angular's defer block to improve perfomance`,
    date: '1 September',
    time: '6pm CET',
    location: 'Warsaw & Online',
    href: 'https://google.com',
  },
};

export const AdBannerStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, adBannerService = inject(AdBannerService)) => ({
    onClose: () => {
      patchState(store, {
        adBannerVisible: false,
      });
    },
    // @todo extend when BFF is ready
    getData: () => {
      switchMap(() =>
        adBannerService.getData().pipe(
          tapResponse({
            next: (adBanner) => {
              patchState(store, { adBanner });
            },
            error: () => {
              patchState(store);
            },
          }),
        ),
      );
    },
  })),
);

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
  adBannerVisible: false,
  adBanner: {
    title: 'FREE EBOOK: The Ultimate Guide to Angular Evolution',
    title_mobile: 'Free ebook',
    description: `Discover How Angular 18 Improves Efficiency, DX, UX, and Performance`,
    description_mobile: 'Angular Evolution',
    additional_info: 'Angular 18',
    href: 'https://houseofangular.io/the-ultimate-guide-to-angular-evolution/?utm_source=angular.love&utm_medium=baner&utm_campaign=angular-evolution24',
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

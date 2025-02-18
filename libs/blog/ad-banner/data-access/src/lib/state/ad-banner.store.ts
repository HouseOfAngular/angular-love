import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';

import { Banners } from '@angular-love/blog/contracts/banners';

import { AdBannerService } from '../infrastructure/ad-banner.service';

type AdBannerState = {
  banners: Banners | null;
};

const initialState: AdBannerState = {
  banners: null,
};

export const AdBannerStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, adBannerService = inject(AdBannerService)) => ({
    getData: rxMethod<void>(
      pipe(
        switchMap(() =>
          adBannerService.getVisibleBanners().pipe(
            tapResponse({
              next: (banners) => {
                patchState(store, { banners });
              },
              error: () => {
                patchState(store);
              },
            }),
          ),
        ),
      ),
    ),
  })),
);

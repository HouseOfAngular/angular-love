import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';

import { Slider } from '@angular-love/blog/contracts/banners';

import { AdBannerService } from '../infrastructure/ad-banner.service';

type AdBannerState = {
  slider: Slider | null;
};

const initialState: AdBannerState = {
  slider: null,
};

export const AdBannerStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, adBannerService = inject(AdBannerService)) => ({
    getData: rxMethod<void>(
      pipe(
        switchMap(() =>
          adBannerService.getBannerSlider().pipe(
            tapResponse({
              next: (slider) => {
                patchState(store, { slider });
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

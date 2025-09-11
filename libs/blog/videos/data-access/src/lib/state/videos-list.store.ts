import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, pipe, tap } from 'rxjs';

import { VideoPreview } from '@angular-love/blog/contracts/videos';
import { withLangState } from '@angular-love/blog/i18n/data-access';
import {
  LoadingState,
  withCallState,
} from '@angular-love/shared/utils-signal-store';

import { VideosQuery } from '../dto/videos.query';
import { VideosService } from '../infrastructure/videos.service';

type VideosListState = {
  videos: VideoPreview[] | null;
  query: VideosQuery;
  total: number;
};

const initialState: VideosListState = {
  videos: null,
  query: null,
  total: 0,
};

export const VideosListStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withLangState(),
  withCallState('fetch videos list'),
  withMethods((store) => {
    const videosService = inject(VideosService);
    return {
      fetchVideosList: rxMethod<VideosQuery>(
        pipe(
          tap((query) =>
            patchState(store, {
              query: query,
              fetchVideosListCallState: LoadingState.LOADING,
            }),
          ),
          concatMap((query) =>
            videosService.getVideosList({ ...query }).pipe(
              tap({
                next: ({ data, total }) =>
                  patchState(store, {
                    videos: data,
                    fetchVideosListCallState: LoadingState.LOADED,
                    total,
                  }),
                error: (error) =>
                  patchState(store, {
                    fetchVideosListCallState: { error },
                  }),
              }),
            ),
          ),
        ),
      ),
    };
  }),
);

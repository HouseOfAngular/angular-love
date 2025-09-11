import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { UiArticleListTitleComponent } from '@angular-love/blog/articles/ui-article-list-title';
import { VideosListStore } from '@angular-love/blog/videos/data-access';
import {
  VideoCardComponent,
  VideoCardSkeletonComponent,
} from '@angular-love/blog/videos/ui-video-card';

const VIDEOS_LIMIT = 3;

@Component({
  selector: 'al-videos-list',
  templateUrl: './videos-list-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiArticleListTitleComponent,
    TranslocoDirective,
    VideoCardComponent,
    VideoCardSkeletonComponent,
  ],
})
export class VideosListContainerComponent {
  private readonly videosListStore = inject(VideosListStore);

  protected readonly skeletonLoaders = [...Array(VIDEOS_LIMIT).keys()];
  protected readonly videos = this.videosListStore.videos;
  protected readonly isFetchVideosListLoading =
    this.videosListStore.isFetchVideosListLoading;

  constructor() {
    const query = computed(() => ({
      take: VIDEOS_LIMIT,
    }));

    this.videosListStore.fetchVideosList(query);
  }
}

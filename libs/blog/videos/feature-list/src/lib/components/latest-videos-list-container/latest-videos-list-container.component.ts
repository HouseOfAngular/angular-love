import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { VideoPreview } from '@angular-love/blog/contracts/videos';
import { UiSectionTitleComponent } from '@angular-love/blog/shared/ui-section-title';
import { VideosListStore } from '@angular-love/blog/videos/data-access';
import {
  VideoCardComponent,
  VideoCardSkeletonComponent,
} from '@angular-love/blog/videos/ui-video-card';

import { VideoDialogManagerService } from '../../services/video-dialog-manager.service';

const LATEST_VIDEOS_LIMIT = 3;

@Component({
  selector: 'al-latest-videos-list',
  templateUrl: './latest-videos-list-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiSectionTitleComponent,
    TranslocoDirective,
    VideoCardComponent,
    VideoCardSkeletonComponent,
  ],
  providers: [VideosListStore],
})
export class LatestVideosListContainerComponent {
  private readonly videosListStore = inject(VideosListStore);
  private readonly videoDialogManager = inject(VideoDialogManagerService);

  protected readonly skeletonLoaders = [...Array(LATEST_VIDEOS_LIMIT).keys()];
  protected readonly videos = this.videosListStore.videos;
  protected readonly isFetchVideosListLoading =
    this.videosListStore.isFetchVideosListLoading;

  constructor() {
    this.videosListStore.fetchVideosList({
      take: LATEST_VIDEOS_LIMIT,
    });
  }

  protected openVideo(video: VideoPreview, videoPlayerTitle: string): void {
    this.videoDialogManager
      .open({
        videoId: video.videoId,
        title: video.title,
        videoPlayerTitle,
      })
      .subscribe();
  }
}

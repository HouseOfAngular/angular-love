import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { VideoCard } from '../../types/video-card';

@Component({
  selector: 'al-video-card',
  templateUrl: './video-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, FastSvgComponent],
})
export class VideoCardComponent {
  readonly video = input.required<VideoCard>();
  readonly videoPlayerTitle = input.required<string>();

  readonly playVideo = output<void>();

  private readonly thumbnailFailed = signal(false);

  protected readonly thumbnailSrc = computed(() => {
    const videoId = this.video().videoId;
    return this.thumbnailFailed()
      ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      : `https://i.ytimg.com/vi_webp/${videoId}/sddefault.webp`;
  });

  protected onThumbnailError(): void {
    this.thumbnailFailed.set(true);
  }
}

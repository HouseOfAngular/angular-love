import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { VideoCard } from '../../types/video-card';

@Component({
  selector: 'al-video-card',
  templateUrl: './video-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoCardComponent {
  private readonly domSanitizer = inject(DomSanitizer);

  readonly video = input.required<VideoCard>();
  readonly videoPlayerTitle = input.required<string>();

  protected readonly videoSrc = computed(() =>
    this.domSanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${this.video().videoId}?rel=0`,
    ),
  );
}

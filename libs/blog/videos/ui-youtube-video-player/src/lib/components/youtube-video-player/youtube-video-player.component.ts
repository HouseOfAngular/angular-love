import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  PLATFORM_ID,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'al-youtube-video-player',
  templateUrl: './youtube-video-player.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full aspect-video',
  },
})
export class YoutubeVideoPlayerComponent {
  private readonly domSanitizer = inject(DomSanitizer);
  private readonly translocoService = inject(TranslocoService);

  readonly videoId = input.required<string>();
  readonly title = input.required<string>();

  readonly lang = toSignal(this.translocoService.langChanges$, {
    initialValue: this.translocoService.getActiveLang(),
  });

  private readonly _origin = isPlatformBrowser(inject(PLATFORM_ID))
    ? window.location.origin
    : // ssr fallback
      'https://angular.love';

  protected readonly videoSrc = computed(() => {
    const lang = encodeURIComponent(this.lang());
    const videoId = encodeURIComponent(this.videoId());
    const origin = encodeURIComponent(this._origin);

    return this.domSanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1&hl=${lang}&cc_lang_pref=${lang}&origin=${origin}`,
    );
  });
}

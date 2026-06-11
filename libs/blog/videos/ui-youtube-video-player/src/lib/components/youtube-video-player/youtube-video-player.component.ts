import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
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

  protected readonly videoSrc = computed(() => {
    const lang = this.lang();
    return this.domSanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${this.videoId()}?rel=0&autoplay=1&hl=${lang}&cc_lang_pref=${lang}`,
    );
  });
}

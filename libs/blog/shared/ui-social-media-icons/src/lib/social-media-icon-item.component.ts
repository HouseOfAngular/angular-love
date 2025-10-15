import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

type SocialMediaBase<
  TIconName extends
    | 'twitter-x'
    | 'github-mark'
    | 'facebook'
    | 'youtube'
    | 'linkedIn',
> = {
  usernameOrPageId: string;
  iconName: TIconName;
  ariaLabel: string;
};

export type SocialMediaIconItemUi =
  | SocialMediaBase<'facebook'>
  | SocialMediaBase<'twitter-x'>
  | SocialMediaBase<'github-mark'>
  | SocialMediaBase<'youtube'>
  | (SocialMediaBase<'linkedIn'> & { isCompany: boolean });

@Component({
  selector: 'al-social-media-icon-item',
  template: `
    @if (href(); as href) {
      <a
        *transloco="let t"
        class="mr-2 flex"
        [attr.aria-label]="t(socialMediaConfig().ariaLabel)"
        [href]="href"
        target="_blank"
      >
        <fast-svg
          aria-hidden="true"
          [name]="socialMediaConfig().iconName"
          size="24"
        />
      </a>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FastSvgComponent, TranslocoDirective],
})
export class SocialMediaIconItemComponent {
  socialMediaConfig = input.required<SocialMediaIconItemUi>();

  href = computed(() => {
    const cfg = this.socialMediaConfig();

    switch (cfg.iconName) {
      case 'facebook':
        return `https://facebook.com/${cfg.usernameOrPageId}`;
      case 'github-mark':
        return `https://github.com/${cfg.usernameOrPageId}`;
      case 'linkedIn':
        return `https://linkedin.com/${cfg.isCompany ? 'company' : 'in'}/${cfg.usernameOrPageId}`;
      case 'twitter-x':
        return `https://x.com/${cfg.usernameOrPageId}`;
      case 'youtube':
        return `https://www.youtube.com/${cfg.usernameOrPageId}`;
      default:
        return null;
    }
  });
}

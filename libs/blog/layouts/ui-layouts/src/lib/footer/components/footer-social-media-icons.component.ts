import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SocialMediaIconsComponent } from '@angular-love/blog/shared/ui-social-media-icons';

@Component({
  selector: 'al-footer-social-media-icons',
  standalone: true,
  imports: [SocialMediaIconsComponent],
  template: `
    <div class="flex flex-col items-start">
      <h3
        id="social-media-title"
        class="mb-4 hidden text-sm font-bold lg:block"
      >
        Social media
      </h3>
      <al-social-media-icons />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterSocialMediaIconsComponent {}

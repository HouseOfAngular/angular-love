import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SocialMediaIconsComponent } from '@angular-love/blog/shared/ui-social-media-icons';

@Component({
  selector: 'al-footer-social-media-icons',
  imports: [SocialMediaIconsComponent],
  template: `
    <div class="flex flex-col items-start">
      <al-social-media-icons variant="default" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterSocialMediaIconsComponent {}

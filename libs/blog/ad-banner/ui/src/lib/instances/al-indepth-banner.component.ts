import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { AdImageBanner } from '../ad-image-banner/ad-image-banner-data.interface';
import { AdImageBannerComponent } from '../ad-image-banner/ad-image-banner.component';

@Component({
  selector: 'al-indepth-banner',
  standalone: true,
  imports: [AdImageBannerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <al-ad-image-banner [banner]="banner()" />
  `,
})
export class AlIndepthBannerComponent {
  protected readonly banner = signal<AdImageBanner>({
    url: 'assets/AL-AID-banner.png',
    alt: 'Banner - Two blogs join forces',
    action: {
      type: 'slug',
      slug: 'angular-love-joins-forces-with-angular-in-depth-to-bring-you-the-best-angular-on-the-web',
    },
  });
}

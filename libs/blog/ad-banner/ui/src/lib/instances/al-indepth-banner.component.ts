import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { AdImageBannerComponent } from '../ad-image-banner/ad-image-banner.component';

@Component({
  selector: 'al-indepth-banner',
  standalone: true,
  imports: [AdImageBannerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <al-ad-image-banner [banner]="banner()!" />
  `,
})
export class AlIndepthBannerComponent {
  protected readonly banner = signal({
    url: 'assets/AL-AID-banner.png',
    alt: 'Banner - Two blogs join forces',
    slug: 'angular-love-joins-forces-with-angular-in-depth-to-bring-you-the-best-angular-on-the-web',
  });
}

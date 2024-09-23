import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { AdImageBanner } from '../../ad-image-banner/ad-image-banner-data.interface';
import { AdImageBannerComponent } from '../../ad-image-banner/ad-image-banner.component';
import { AlInfiniteSliderDirective } from '../../infinite-slider-directive/al-infinite-slider.directive';

import { AUTUMN_CAMP_BANNERS } from './autumn-camp-banners.const';

@Component({
  selector: 'al-autumn-camp-banner',
  standalone: true,
  imports: [AdImageBannerComponent, AlInfiniteSliderDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overflow-hidden">
      <div class="flex">
        <al-ad-image-banner
          *alInfiniteSlider="let banner of banners()"
          class="flex-shrink-0 flex-grow-0 basis-full"
          [banner]="banner"
        ></al-ad-image-banner>
      </div>
    </div>
  `,
})
export class AlAutumnCampBannerComponent {
  protected readonly banners = signal<AdImageBanner[]>(AUTUMN_CAMP_BANNERS);
}

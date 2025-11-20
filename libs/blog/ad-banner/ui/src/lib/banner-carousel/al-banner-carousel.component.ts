import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AdImageBanner } from '../ad-image-banner/ad-image-banner-data.interface';
import { AdImageBannerComponent } from '../ad-image-banner/ad-image-banner.component';
import { AlInfiniteSliderDirective } from '../infinite-slider-directive/al-infinite-slider.directive';

@Component({
  selector: 'al-banner-carousel',
  imports: [AdImageBannerComponent, AlInfiniteSliderDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overflow-hidden">
      <div class="flex">
        @if (banners().length > 1) {
          <al-ad-image-banner
            *alInfiniteSlider="
              let banner of banners();
              msPerSlide: msPerSlide()
            "
            class="shrink-0 grow-0 basis-full"
            [banner]="banner"
          />
        } @else if (banners().length === 1) {
          <al-ad-image-banner
            class="shrink-0 grow-0 basis-full"
            [banner]="banners()[0]"
          />
        }
      </div>
    </div>
  `,
})
export class AlBannerCarouselComponent {
  readonly banners = input.required<AdImageBanner[]>();
  readonly msPerSlide = input.required<number>();
}

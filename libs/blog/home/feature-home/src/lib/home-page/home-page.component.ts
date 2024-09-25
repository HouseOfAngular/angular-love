import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AdBannerStore } from '@angular-love/blog/ad-banner/data-access';
import { ArticlesListContainerComponent } from '@angular-love/blog/articles/feature-list';
import { UiArticleCardComponent } from '@angular-love/blog/articles/ui-article-card';
import { NewsletterComponent } from '@angular-love/blog/newsletter';
import { PartnersComponent } from '@angular-love/blog/partners/ui-partners';
import {
  AdImageBanner,
  AdImageBannerComponent,
  AlBannerCarouselComponent,
} from '@angular-love/blog/shared/ad-banner';
import { CardComponent } from '@angular-love/blog/shared/ui-card';
import { FeatureLatestArticlesComponent } from '@angular-love/feature-latest-articles';

import { hoaHireUs, partnersList } from './partners';

@Component({
  selector: 'al-home-page',
  standalone: true,
  imports: [
    NewsletterComponent,
    ReactiveFormsModule,
    CardComponent,
    NewsletterComponent,
    PartnersComponent,
    FeatureLatestArticlesComponent,
    UiArticleCardComponent,
    ArticlesListContainerComponent,
    AdImageBannerComponent,
    AlBannerCarouselComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  protected readonly hoaHireUs = hoaHireUs;
  protected readonly partnersList = partnersList;
  protected readonly sliderStore = inject(AdBannerStore);
  protected readonly slides = computed<AdImageBanner[] | undefined>(() =>
    this.sliderStore.slider()?.slides.map((slide) => ({
      url: slide.url,
      alt: slide.alt,
      action: {
        type: 'url',
        url: slide.navigateTo,
      },
    })),
  );
  protected readonly msPerSlide = computed(
    () => this.sliderStore.slider()?.slideDisplayTimeMs,
  );

  constructor() {
    this.sliderStore.getData();
  }
}

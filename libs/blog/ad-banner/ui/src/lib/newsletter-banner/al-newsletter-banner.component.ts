import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CardBanner } from '@angular-love/blog/contracts/banners';

@Component({
  selector: 'al-newsletter-banner',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      class="relative flex h-full items-center"
      [href]="cardBanner().navigateTo!"
    >
      <aside class="absolute h-full w-full overflow-hidden rounded-lg">
        <img
          tabindex="0"
          role="button"
          class="!relative object-cover shadow-inner blur-xl"
          [attr.aria-label]="cardBanner()!.alt!"
          [alt]="cardBanner().alt!"
          [ngSrc]="cardBanner().url!"
          fill
          priority
        />
      </aside>
      <aside>
        <img
          tabindex="0"
          role="button"
          class="!relative"
          [attr.aria-label]="cardBanner().alt!"
          [alt]="cardBanner().alt!"
          [ngSrc]="cardBanner().url!"
          fill
          priority
        />
      </aside>
    </a>
  `,
})
export class AlNewsletterBannerComponent {
  readonly cardBanner = input.required<CardBanner>();
}

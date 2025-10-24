import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import { RelatedArticleListStore } from '@angular-love/blog/articles/data-access';
import { UiArticleCardComponent } from '@angular-love/blog/articles/ui-article-card';
import { ButtonComponent } from '@angular-love/blog/shared/ui-button';

@Component({
  selector: 'al-related-articles',
  template: `
    @if (store.isFetchRelatedArticleListLoaded()) {
      <ng-container *transloco="let t; read: 'relatedArticles'">
        <h2 class="mb-4 text-3xl font-bold">{{ t('title') }}</h2>
        <div class="relative lg:px-14">
          <owl-carousel-o #carousel role="list" [options]="customOptions">
            @for (article of store.relatedArticles(); track $index) {
              <ng-template carouselSlide>
                <!-- Prevents focus rings from being cut off -->
                <li class="list-none py-1">
                  <al-article-card [article]="article" cardType="compact" />
                </li>
              </ng-template>
            }
          </owl-carousel-o>
          <div
            class="absolute left-0 top-1/2 hidden w-full -translate-y-1/2 justify-between lg:flex"
          >
            <button
              al-button
              type="button"
              class="bg-al-pink text-white"
              [attr.aria-label]="t('previousSlide')"
              (click)="carousel.prev()"
              size="small"
            >
              <span class="text-2xl">‹</span>
            </button>
            <button
              al-button
              type="button"
              class="bg-al-pink text-white"
              [attr.aria-label]="t('nextSlide')"
              (click)="carousel.next()"
              size="small"
            >
              <span class="text-2xl">›</span>
            </button>
          </div>
        </div>
      </ng-container>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RelatedArticleListStore],
  imports: [
    UiArticleCardComponent,
    CarouselModule,
    ButtonComponent,
    TranslocoDirective,
  ],
})
export class RelatedArticlesComponent implements OnInit {
  readonly id = input.required<number>();
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    margin: 24,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      // Keep in mind these breakpoints refer to container width, not the viewport width
      0: {
        items: 1,
      },
      540: {
        items: 2,
      },
    },
  };

  readonly store = inject(RelatedArticleListStore);

  ngOnInit(): void {
    this.store.fetchArticleList(this.id);
  }
}

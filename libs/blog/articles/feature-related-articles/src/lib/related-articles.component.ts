import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import { RelatedArticleListStore } from '@angular-love/blog/articles/data-access';
import { UiArticleCardComponent } from '@angular-love/blog/articles/ui-article-card';

@Component({
  selector: 'al-related-articles',
  template: `
    @if (store.isFetchRelatedArticleListLoaded()) {
      <strong class="text-3xl">Related Articles</strong>
      <owl-carousel-o [options]="customOptions">
        @for (article of store.relatedArticles(); track $index) {
          <ng-template carouselSlide>
            <al-article-card [article]="article" cardType="compact" />
          </ng-template>
          <ng-template carouselSlide>
            <al-article-card [article]="article" cardType="compact" />
          </ng-template>
        }
      </owl-carousel-o>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RelatedArticleListStore],
  imports: [UiArticleCardComponent, CarouselModule],
})
export class RelatedArticlesComponent implements OnInit {
  readonly id = input.required<number>();
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    margin: 24, // Add spacing between items
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      // Keep in mind these breakpoints refer to container width, not the viewport width
      0: {
        items: 1,
      },
      640: {
        items: 2,
      },
    },
    nav: true,
  };

  readonly store = inject(RelatedArticleListStore);

  ngOnInit(): void {
    this.store.fetchArticleList(this.id);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  effect,
  HostBinding,
  inject,
  input,
} from '@angular/core';

import { ArticleDetailsStore } from '@angular-love/blog/articles/data-access';
import { BreadcrumbComponent } from '@angular-love/blog/shared/ui-breadcrumb';

import { ArticleDetailsSkeletonComponent } from '../article-details/article-details-skeleton.component';
import { ArticleDetailsComponent } from '../article-details/article-details.component';

@Component({
  selector: 'al-article-details-container',
  standalone: true,
  imports: [
    ArticleDetailsSkeletonComponent,
    ArticleDetailsComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './article-details-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
})
export class ArticleDetailsContainerComponent {
  @HostBinding('attr.aria-live') ariaLive = 'polite';

  private readonly articleDetailsStore = inject(ArticleDetailsStore);

  readonly articleSlug = input.required<string>();

  readonly isFetchArticleDetailsLoading =
    this.articleDetailsStore.isFetchArticleDetailsLoading;

  readonly articleDetails = this.articleDetailsStore.articleDetails;

  readonly isFetchArticleDetailsError =
    this.articleDetailsStore.isFetchArticleDetailsError;

  constructor() {
    this.articleDetailsStore.fetchArticleDetails(this.articleSlug);
    effect(() => {
      this.ariaLive = this.articleDetailsStore.isFetchArticleDetailsLoading()
        ? 'polite'
        : 'off';
    });
  }
}

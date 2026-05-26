import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import {
  ArticleDetailsStore,
  IsArticlePreview,
} from '@angular-love/blog/articles/data-access';
import { NotFoundPageComponent } from '@angular-love/blog/shared/ui-not-found';

import { ArticleDetailsSkeletonComponent } from '../article-details/article-details-skeleton.component';
import { ArticleDetailsComponent } from '../article-details/article-details.component';

@Component({
  selector: 'al-article-details-container',
  imports: [
    ArticleDetailsSkeletonComponent,
    ArticleDetailsComponent,
    NotFoundPageComponent,
  ],
  templateUrl: './article-details-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
    'aria-live': 'polite',
  },
})
export class ArticleDetailsContainerComponent {
  private readonly articleDetailsStore = inject(ArticleDetailsStore);

  readonly articleSlug = input.required<string>();

  readonly isFetchArticleDetailsLoading =
    this.articleDetailsStore.isFetchArticleDetailsLoading;

  readonly articleDetails = this.articleDetailsStore.articleDetails;

  readonly isFetchArticleDetailsError =
    this.articleDetailsStore.isFetchArticleDetailsError;

  constructor() {
    if (inject(IsArticlePreview)) {
      this.articleDetailsStore.fetchArticleDetails(this.articleSlug);
    }
  }
}

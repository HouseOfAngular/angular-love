import { Component, inject, Signal } from '@angular/core';
import {
  Article,
  ArticleDetailsStore,
} from '@angular-love/blog/articles/data-access';
import { ActivatedRoute } from '@angular/router';
import { ArticleDetailsComponent } from '../article-details/article-details.component';
import { ArticleDetailsSkeletonComponent } from '../article-details/article-details-skeleton.component';

@Component({
  selector: 'al-article-details-container',
  standalone: true,
  imports: [ArticleDetailsSkeletonComponent, ArticleDetailsComponent],
  templateUrl: './article-details-container.component.html',
})
export class ArticleDetailsContainerComponent {
  private readonly articleDetailsStore = inject(ArticleDetailsStore);
  private readonly slug = inject(ActivatedRoute).snapshot.paramMap.get('slug')!;

  readonly isFetchArticleDetailsLoading: Signal<boolean> =
    this.articleDetailsStore.isFetchArticleDetailsLoading;
  readonly articleDetails: Signal<Article | null> =
    this.articleDetailsStore.articleDetails;
  readonly isFetchArticleDetailsError =
    this.articleDetailsStore.isFetchArticleDetailsError;

  constructor() {
    this.articleDetailsStore.fetchArticleDetails({ slug: this.slug });
  }
}

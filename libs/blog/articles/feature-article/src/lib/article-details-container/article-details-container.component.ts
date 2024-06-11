import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { filter, switchMap, take, tap } from 'rxjs';

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
  private readonly articleDetailsStore = inject(ArticleDetailsStore);
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);

  readonly articleSlug = input.required<string>();

  readonly isFetchArticleDetailsLoading =
    this.articleDetailsStore.isFetchArticleDetailsLoading;

  readonly articleDetails = this.articleDetailsStore.articleDetails;

  readonly isFetchArticleDetailsError =
    this.articleDetailsStore.isFetchArticleDetailsError;

  constructor() {
    this.articleDetailsStore.fetchArticleDetails(this.articleSlug);
    this.translocoService.langChanges$
      .pipe(
        takeUntilDestroyed(),
        switchMap((lang) =>
          toObservable(this.articleDetailsStore.articleDetails).pipe(
            filter((article) => !!article),
            take(1),
            tap(() => {
              const correctSlug = this.articleDetailsStore.correctSlug();
              if (!correctSlug) {
                this.router.navigate(['/', lang]);
              } else {
                this.articleDetailsStore.changeSlugParam(
                  this.articleDetailsStore.correctSlug(),
                );
              }
            }),
          ),
        ),
      )
      .subscribe();
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { ArticleListStore } from '@angular-love/blog/articles/data-access';
import { AlIndepthBannerComponent } from '@angular-love/blog/shared/ad-banner';
import { ArticlePreview } from '@angular-love/contracts/articles';

import { CategorySectionContainerComponent } from './category-section-container/category-section-container.component';

@Component({
  selector: 'al-articles-list',
  templateUrl: './articles-list-container.component.html',
  imports: [CategorySectionContainerComponent, AlIndepthBannerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesListContainerComponent {
  readonly activeLang = inject(TranslocoService).getActiveLang();
  private readonly _articleListStore = inject(ArticleListStore);

  readonly isFetchArticleListLoading: Signal<boolean> =
    this._articleListStore.isFetchArticleListLoading;

  readonly articleList: Signal<ArticlePreview[] | null> =
    this._articleListStore.articles;
  readonly isFetchArticleListError =
    this._articleListStore.isFetchArticleListError;

  constructor() {
    this._articleListStore.fetchArticleList(null);
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { UiArticleCardComponent } from '@angular-love/blog/articles/ui-article-card';
import { NewsletterComponent } from '@angular-love/blog/newsletter';
import { SearchListStore } from '@angular-love/blog/search/data-access';
import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';
import {
  PaginationComponent,
  QueryPaginationDirective,
} from '@angular-love/blog/shared/ui-pagination';

import { SearchResultsPagePresenter } from './search-results-page.presenter';

@Component({
  selector: 'al-search-results-page',
  standalone: true,
  templateUrl: './search-results-page.component.html',
  styleUrl: './search-results-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SearchListStore, SearchResultsPagePresenter],
  imports: [
    UiArticleCardComponent,
    NewsletterComponent,
    CardComponent,
    GradientCardDirective,
    PaginationComponent,
    QueryPaginationDirective,
  ],
})
export class SearchResultsPageComponent {
  readonly searchStore = inject(SearchListStore);
  readonly presenter = inject(SearchResultsPagePresenter);

  constructor() {
    this.searchStore.search$(this.presenter.searchPayload);
  }
}

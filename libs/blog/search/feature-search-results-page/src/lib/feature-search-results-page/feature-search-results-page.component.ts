import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UiArticleCardComponent } from '@angular-love/blog/articles/ui-article-card';
import { SearchStore } from '@angular-love/blog/search/data-access';
import { BreadcrumbComponent } from '@angular-love/blog/shared/ui-breadcrumb';
import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';
import {
  PageChangeEvent,
  PaginationComponent,
} from '@angular-love/blog/shared/ui-pagination';
import { NewsletterComponent } from '@angular-love/newsletter';

@Component({
  selector: 'al-feature-search-results-page',
  standalone: true,
  templateUrl: './feature-search-results-page.component.html',
  styleUrl: './feature-search-results-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UiArticleCardComponent,
    NewsletterComponent,
    BreadcrumbComponent,
    CardComponent,
    GradientCardDirective,
    PaginationComponent,
  ],
})
export class FeatureSearchResultsPageComponent implements OnInit {
  readonly searchStore = inject(SearchStore);
  readonly result = this.searchStore.result;
  readonly mappedResults = this.searchStore.searchResultPageItems;
  readonly pageSize = this.searchStore.pageSize();
  readonly pagination = signal({ skip: 0, take: this.pageSize });

  private readonly _route = inject(ActivatedRoute);

  ngOnInit(): void {
    const query = this._route.snapshot.queryParamMap.get('q');
    this.searchStore.updateQuery(query || '');
  }

  onPageChange(e: PageChangeEvent): void {
    const page = Math.floor(e.skip / e.take);
    this.searchStore.updatePage(page);
  }
}

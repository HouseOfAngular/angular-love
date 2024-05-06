import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SearchStore } from '@angular-love/blog/search/data-access';
import { BreadcrumbComponent } from '@angular-love/blog/shared/ui/breadcrumb';
import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui/card';
import { NewsletterComponent } from '@angular-love/newsletter';
import { UiArticleCardComponent } from '@angular-love/ui-article-card';

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
  ],
})
export class FeatureSearchResultsPageComponent implements OnInit {
  private readonly _searchStore = inject(SearchStore);
  private readonly _route = inject(ActivatedRoute);

  result = this._searchStore.result;
  mappedResults = this._searchStore.searchResultPageItems;

  ngOnInit(): void {
    const query = this._route.snapshot.queryParamMap.get('q');
    this._searchStore.updateQuery(query || '');
  }
}

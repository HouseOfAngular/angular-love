import { SearchResponse } from '@algolia/client-search';
import {
  ArticleSearchResultDto,
  SearchStore,
} from '@angular-love/blog/search/data-access';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'al-feature-search-results-page',
  standalone: true,
  templateUrl: './feature-search-results-page.component.html',
  styleUrl: './feature-search-results-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSearchResultsPageComponent implements OnInit {
  private readonly _searchStore = inject(SearchStore);
  private readonly route = inject(ActivatedRoute);

  results = computed<SearchResponse<ArticleSearchResultDto>>(() => {
    console.log(this._searchStore.results());
    return this._searchStore.results();
  });

  ngOnInit(): void {
    const query = this.route.snapshot.queryParamMap.get('q');

    this._searchStore.updateQuery(query || '');
  }
}

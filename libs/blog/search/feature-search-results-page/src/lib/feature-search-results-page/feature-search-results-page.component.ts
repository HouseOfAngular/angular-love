import { SearchResponse } from '@algolia/client-search';
import { ArticleCardDataModel } from '@angular-love/article-card-data-model';
import {
  ArticleSearchResultDto,
  SearchStore,
} from '@angular-love/blog/search/data-access';
import { NewsletterComponent } from '@angular-love/newsletter';
import { UiArticleCardComponent } from '@angular-love/ui-article-card';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { mapToCardModel } from './search-dto-to-card-model.mapper';

@Component({
  selector: 'al-feature-search-results-page',
  standalone: true,
  templateUrl: './feature-search-results-page.component.html',
  styleUrl: './feature-search-results-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiArticleCardComponent, NewsletterComponent],
})
export class FeatureSearchResultsPageComponent implements OnInit {
  private readonly _searchStore = inject(SearchStore);
  private readonly route = inject(ActivatedRoute);

  resultsCount = computed<number>(() => {
    return this._searchStore.results().nbHits;
  });

  results = computed<SearchResponse<ArticleSearchResultDto>>(() => {
    return this._searchStore.results();
  });

  mappedResults = computed<ArticleCardDataModel[]>(() => {
    return this.results().hits.map(mapToCardModel);
  });

  ngOnInit(): void {
    const query = this.route.snapshot.queryParamMap.get('q');
    this._searchStore.updateQuery(query || '');
  }
}

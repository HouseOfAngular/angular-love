import { Hit } from '@algolia/client-search';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AlgoliaArticleSearchResultDto } from '@angular-love/blog/search/data-access';

@Component({
  selector: 'al-search-result-item',
  standalone: true,
  templateUrl: './search-result-item.component.html',
  styleUrl: './search-result-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultItemComponent {
  hit = input.required<Hit<AlgoliaArticleSearchResultDto>>();
}

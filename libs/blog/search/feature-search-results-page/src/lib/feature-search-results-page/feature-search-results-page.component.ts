import { SearchStore } from '@angular-love/blog/search/data-access';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';

@Component({
  selector: 'al-feature-search-results-page',
  standalone: true,
  imports: [],
  templateUrl: './feature-search-results-page.component.html',
  styleUrl: './feature-search-results-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSearchResultsPageComponent implements OnInit {
  private readonly _searchStore = inject(SearchStore);

  ngOnInit(): void {
    console.log(this._searchStore.query());
  }
}

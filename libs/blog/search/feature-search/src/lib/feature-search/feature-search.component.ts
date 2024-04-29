import { Hit } from '@algolia/client-search';
import {
  ArticleSearchResultDto,
  SearchService,
  SearchStore,
} from '@angular-love/blog/search/data-access';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'al-feature-search',
  standalone: true,
  imports: [ReactiveFormsModule, NgIconComponent, RouterLink],
  templateUrl: './feature-search.component.html',
  styleUrl: './feature-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SearchService,
    provideIcons({ heroMagnifyingGlass }),
    SearchStore,
  ],
})
export class BlogSearchFeatureSearchComponent implements OnInit, OnDestroy {
  private readonly _searchStore = inject(SearchStore);

  private readonly searchInput =
    viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  searchForm = new FormControl('');

  resultsCount = computed<number>(() => {
    return this._searchStore.results().nbHits || 0;
  });

  hits = computed<Hit<ArticleSearchResultDto>[]>(() => {
    return this._searchStore.results().hits;
  });

  constructor() {
    this.searchForm.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed())
      .subscribe((v) => {
        this._searchStore.updateQuery(v as string);
      });
  }

  ngOnInit(): void {
    this.searchInput().nativeElement.focus();
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
  }
}

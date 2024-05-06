import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { debounceTime, startWith } from 'rxjs';

import { SearchStore } from '@angular-love/blog/search/data-access';
import { SearchResultItemComponent } from '@angular-love/search-result-item';

@Component({
  selector: 'al-feature-search',
  standalone: true,
  imports: [ReactiveFormsModule, NgIconComponent, SearchResultItemComponent],
  templateUrl: './feature-search.component.html',
  styleUrl: './feature-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ heroMagnifyingGlass })],
})
export class FeatureSearchComponent implements OnInit, OnDestroy {
  private readonly _searchStore = inject(SearchStore);

  private readonly _searchInput =
    viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  private readonly _router = inject(Router);

  searchForm = new FormControl('', {
    validators: [Validators.maxLength(50)],
  });

  resultsCount = this._searchStore.resultsCount;

  hits = this._searchStore.hits;

  @HostListener('click', ['$event.target']) onClick(target: HTMLElement): void {
    if (target.classList.contains('al-overlay')) {
      this.closeSearch();
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this.closeSearch();
    }

    if (e.key === 'Enter') {
      this._router.navigate(['search'], {
        queryParams: {
          q: this.searchForm.value,
        },
      });
    }
  }

  ngOnInit(): void {
    this._searchInput().nativeElement.focus();
    document.body.style.overflow = 'hidden';

    const value$ = this.searchForm.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
    );
    this._searchStore.updateQuery(value$);
  }

  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
  }

  private closeSearch(): void {
    this._router.navigate(['./'], {
      queryParams: {
        isSearchOpen: false,
      },
      queryParamsHandling: 'merge',
      skipLocationChange: true,
    });
  }
}

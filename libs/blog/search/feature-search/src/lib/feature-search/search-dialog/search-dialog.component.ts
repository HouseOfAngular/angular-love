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
import { Router, RouterLink } from '@angular/router';
import { debounceTime, startWith } from 'rxjs';

import {
  GlobalSearchStore,
  provideSearch,
} from '@angular-love/blog/search/data-access';
import { IconComponent } from '@angular-love/blog/shared/ui-icon';
import { SearchResultItemComponent } from '@angular-love/search-result-item';

import { GlobalSearchService } from '../global-search.service';

@Component({
  selector: 'al-search-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IconComponent,
    SearchResultItemComponent,
    RouterLink,
  ],
  templateUrl: './search-dialog.component.html',
  styleUrl: './search-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideSearch(), GlobalSearchStore],
})
export class SearchDialogComponent implements OnInit, OnDestroy {
  readonly searchStore = inject(GlobalSearchStore);
  readonly searchForm = new FormControl('', {
    validators: [Validators.maxLength(50)],
  });

  private readonly _searchService = inject(GlobalSearchService);
  private readonly _searchInput =
    viewChild.required<ElementRef<HTMLInputElement>>('searchInput');
  private readonly _router = inject(Router);

  @HostListener('click', ['$event.target']) onClick(target: HTMLElement): void {
    if (target.classList.contains('al-overlay')) {
      this.closeSearch();
    }
  }

  @HostListener('keydown.enter', ['$event']) onEnterKeyDown(
    e: KeyboardEvent,
  ): void {
    e.preventDefault();
    this.goToAllResults();
  }

  @HostListener('keydown.escape', ['$event']) onEscapeKeyDown(
    e: KeyboardEvent,
  ): void {
    e.preventDefault();
    this.closeSearch();
  }

  ngOnInit(): void {
    this._searchInput().nativeElement.focus();
    document.body.style.overflow = 'hidden';

    const value$ = this.searchForm.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
    );
    this.searchStore.updateQuery(value$);
  }

  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
  }

  goToAllResults(): void {
    const totalResults = this.searchStore.total();
    if (totalResults && totalResults > 0) {
      this._router.navigate(['search'], {
        queryParams: {
          q: this.searchForm.value,
        },
      });
      this.closeSearch();
    }
  }

  navigateToResult(slug: string): void {
    this._router.navigate(['article', slug]);
    this.closeSearch();
  }

  private closeSearch(): void {
    this._searchService.hideSearchDialog();
  }
}

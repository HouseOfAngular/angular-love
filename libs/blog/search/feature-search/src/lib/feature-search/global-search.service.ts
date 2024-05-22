import { Injectable, signal } from '@angular/core';

@Injectable()
export class GlobalSearchService {
  private readonly _isSearchOpen = signal<boolean>(false);
  readonly isSearchOpen = this._isSearchOpen.asReadonly();

  showSearchDialog(): void {
    this._isSearchOpen.set(true);
  }

  hideSearchDialog(): void {
    this._isSearchOpen.set(false);
  }
}

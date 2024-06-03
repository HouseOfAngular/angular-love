import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
} from '@angular/core';

import { IconComponent } from '@angular-love/blog/shared/ui-icon';

import { GlobalSearchService } from './global-search.service';
import { SearchDialogComponent } from './search-dialog';

@Component({
  selector: 'al-search',
  standalone: true,
  imports: [SearchDialogComponent, IconComponent],
  template: `
    <button
      aria-label="Open a search dialog"
      class="flex items-center bg-transparent p-1"
      (click)="service.showSearchDialog()"
    >
      <al-icon name="magnifier-glass" class="bg-al-pink h-6" />
    </button>

    @defer (when service.isSearchOpen()) {
      @if (service.isSearchOpen()) {
        <al-search-dialog />
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GlobalSearchService],
})
export class SearchComponent {
  readonly service = inject(GlobalSearchService);

  @HostListener('document:keydown.control.k', ['$event']) searchKeyHandler(
    event: KeyboardEvent,
  ) {
    event.preventDefault();
    this.service.showSearchDialog();
  }
}

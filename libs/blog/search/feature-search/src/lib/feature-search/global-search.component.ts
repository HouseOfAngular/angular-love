import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { GlobalSearchService } from './global-search.service';
import { SearchDialogComponent } from './search-dialog';

@Component({
  selector: 'al-search',
  imports: [SearchDialogComponent, FastSvgComponent, TranslocoDirective],
  template: `
    <button
      *transloco="let t; read: 'nav'"
      class="flex items-center bg-transparent p-1"
      [attr.aria-label]="t('open_search_dialog')"
      (click)="service.showSearchDialog()"
      date-testid="header-search"
    >
      <fast-svg name="magnifier-glass" class="text-al-pink" size="24" />
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

import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroChevronLeft, heroChevronRight } from '@ng-icons/heroicons/outline';

import { ButtonComponent } from '@angular-love/blog/shared/ui-button';

import { paginationStore } from './pagination.store';

export type PageChangeEvent = {
  skip: number;
  take: number;
};

@Component({
  selector: 'al-pagination',
  imports: [ButtonComponent, NgIcon, NgClass, TranslocoDirective],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    paginationStore,
    provideIcons({ heroChevronLeft, heroChevronRight }),
  ],
})
export class PaginationComponent {
  pageChange = output<PageChangeEvent>();

  pageSize = input.required<number>();

  skip = input.required<number>();

  total = input.required<number>();

  protected readonly store = inject(paginationStore);

  constructor() {
    this.store.setSkip(this.skip);
    this.store.setPageSize(this.pageSize);
    this.store.setTotal(this.total);
  }

  getCurrentPage() {
    return this.store.page();
  }

  setNextPage() {
    this.store.setNextPage();
    this.emitPageChange();
  }

  setPreviousPage() {
    this.store.setPreviousPage();
    this.emitPageChange();
  }

  setPage(page: number) {
    this.store.setPage(page);
    this.emitPageChange();
  }

  private emitPageChange() {
    this.pageChange.emit({
      skip: this.store.skip(),
      take: this.store.pageSize(),
    });
  }
}

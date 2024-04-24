import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  inject,
  input,
  output,
} from '@angular/core';
import { ButtonComponent } from '@angular-love/blog/shared/ui/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroChevronLeft, heroChevronRight } from '@ng-icons/heroicons/outline';
import { paginationStore } from './pagination.store';
import { ActivatedRoute, Router } from '@angular/router';
import {
  outputToObservable,
  takeUntilDestroyed,
} from '@angular/core/rxjs-interop';

export type PageChangeEvent = {
  skip: number;
  take: number;
};

@Component({
  selector: 'al-pagination',
  standalone: true,
  imports: [ButtonComponent, NgIcon],
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

@Directive({
  selector: 'al-pagination[alQueryPagination]',
  standalone: true,
})
export class QueryPaginationDirective {
  readonly pagination = inject(PaginationComponent);

  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  constructor() {
    outputToObservable(this.pagination.pageChange)
      .pipe(takeUntilDestroyed())
      .subscribe(({ skip, take }) => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { skip, take },
        });
      });
  }
}

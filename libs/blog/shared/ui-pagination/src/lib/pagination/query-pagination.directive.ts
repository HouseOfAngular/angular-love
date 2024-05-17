import { Directive, inject } from '@angular/core';
import {
  outputToObservable,
  takeUntilDestroyed,
} from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, filter, map } from 'rxjs';

import { PaginationComponent } from './pagination.component';

@Directive({
  selector: 'al-pagination[alQueryPagination]',
  standalone: true,
})
export class QueryPaginationDirective {
  readonly pageParam = 'page';

  readonly pagination = inject(PaginationComponent);

  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  constructor() {
    outputToObservable(this.pagination.pageChange)
      .pipe(takeUntilDestroyed())
      .subscribe(({ skip, take }) => {
        const page = Math.floor(skip / take) + 1;
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { [this.pageParam]: page > 1 ? page : undefined },
          queryParamsHandling: 'merge',
        });
      });

    //handle user navigation ex: browser back/forward
    this.route.queryParams
      .pipe(
        takeUntilDestroyed(),
        map((params) => {
          const pageParam = params[this.pageParam];
          if (pageParam && Number(pageParam)) {
            return Number(pageParam);
          }
          return 1;
        }),
        filter((page) => this.pagination.getCurrentPage() !== page),
        distinctUntilChanged(),
      )
      .subscribe((page) => {
        this.pagination.setPage(page);
      });
  }
}

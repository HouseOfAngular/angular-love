import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { PresentationsListStore } from '@angular-love/blog/presentations/data-access';
import {
  PresentationCardComponent,
  PresentationCardSkeletonComponent,
} from '@angular-love/blog/presentations/ui-presentation-card';
import { ButtonComponent } from '@angular-love/blog/shared/ui-button';
import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';
import {
  PageChangeEvent,
  PaginationComponent,
  QueryPaginationDirective,
} from '@angular-love/blog/shared/ui-pagination';
import { RepeatDirective } from '@angular-love/utils';

@Component({
  selector: 'al-presentations-page',
  imports: [
    PaginationComponent,
    QueryPaginationDirective,
    PresentationCardComponent,
    PresentationCardSkeletonComponent,
    RepeatDirective,
    NgOptimizedImage,
    CardComponent,
    GradientCardDirective,
    RouterLink,
    ButtonComponent,
  ],
  templateUrl: './presentations-page.component.html',
  styleUrl: './presentations-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col h-full w-full',
  },
})
export class PresentationsPageComponent {
  readonly title = input.required<string>();

  readonly pagination = signal({ take: 12, skip: 0 });

  protected readonly presentationsStore = inject(PresentationsListStore);

  private readonly _platform = inject(PLATFORM_ID);

  constructor() {
    const query = computed(() => ({
      ...this.pagination(),
    }));

    this.presentationsStore.fetchPresentationsList(query);
  }

  protected pageChange(event: PageChangeEvent) {
    isPlatformBrowser(this._platform) && window.scrollTo(0, 0);
    this.pagination.set(event);
  }
}

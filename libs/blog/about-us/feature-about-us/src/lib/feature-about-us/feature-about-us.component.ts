import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { AuthorListStore } from '@angular-love/blog/authors/data-access';
import { AuthorCardComponent } from '@angular-love/blog/authors/ui-author-card';
import { NewsletterComponent } from '@angular-love/blog/newsletter';
import { BreadcrumbComponent } from '@angular-love/blog/shared/ui-breadcrumb';
import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';
import { InfiniteScrollTriggerDirective } from '@angular-love/blog/shared/ui-pagination';
import { SocialMediaIconsComponent } from '@angular-love/blog/shared/ui-social-media-icons';

@Component({
  selector: 'al-about-us',
  standalone: true,
  imports: [
    CardComponent,
    BreadcrumbComponent,
    NewsletterComponent,
    SocialMediaIconsComponent,
    GradientCardDirective,
    AuthorCardComponent,
    InfiniteScrollTriggerDirective,
    TranslocoPipe,
    TranslocoDirective,
  ],
  templateUrl: './feature-about-us.component.html',
  styleUrl: './feature-about-us.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AuthorListStore],
})
export class FeatureAboutUsComponent implements OnInit {
  private readonly _authorListStore = inject(AuthorListStore);
  readonly authorsCards = this._authorListStore.authorCards;

  noAuthorsInView = computed(() => {
    return this.authorsCards()?.length || 0;
  });

  private readonly _skip = this._authorListStore.skip;
  private readonly _total = this._authorListStore.total;
  private readonly _pageSize = this._authorListStore.pageSize;
  private readonly _sortedTitles =
    'key_contributor,contributor,gde,hoa,blogger';

  ngOnInit(): void {
    if (this.authorsCards().length === 0) {
      this._authorListStore.fetchAuthorList({
        take: this._pageSize(),
        skip: 0,
        sorted_titles: this._sortedTitles,
      });
    }
  }

  loadPage(): void {
    if (this._skip() <= this._total()) {
      this._authorListStore.fetchAuthorList({
        take: this._pageSize(),
        skip: this._skip() + this._pageSize(),
        sorted_titles: this._sortedTitles,
      });
    }
  }
}

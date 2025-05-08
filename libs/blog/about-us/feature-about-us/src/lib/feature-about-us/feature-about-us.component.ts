import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { AuthorListStore } from '@angular-love/blog/authors/data-access';
import { AuthorCardComponent } from '@angular-love/blog/authors/ui-author-card';
import { NewsletterComponent } from '@angular-love/blog/newsletter';
import {
  CardComponent,
  DarkGradientCardDirective,
} from '@angular-love/blog/shared/ui-card';
import { InfiniteScrollTriggerDirective } from '@angular-love/blog/shared/ui-pagination';
import { SocialMediaIconsComponent } from '@angular-love/blog/shared/ui-social-media-icons';

@Component({
  selector: 'al-about-us',
  imports: [
    CardComponent,
    NewsletterComponent,
    SocialMediaIconsComponent,
    DarkGradientCardDirective,
    AuthorCardComponent,
    InfiniteScrollTriggerDirective,
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
  private readonly _acfFormat = 'standard';

  ngOnInit(): void {
    if (this.authorsCards().length === 0) {
      this._authorListStore.fetchAuthorList({
        take: this._pageSize(),
        skip: 0,
        sortedTitles: this._sortedTitles,
        acfFormat: this._acfFormat,
      });
    }
  }

  loadPage(): void {
    if (this._skip() <= this._total()) {
      this._authorListStore.fetchAuthorList({
        take: this._pageSize(),
        skip: this._skip() + this._pageSize(),
        sortedTitles: this._sortedTitles,
        acfFormat: this._acfFormat,
      });
    }
  }
}

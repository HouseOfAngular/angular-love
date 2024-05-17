import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';

import { AuthorListStore } from '@angular-love/blog/authors/data-access';
import { AuthorCardComponent } from '@angular-love/blog/authors/ui-author-card';
import { AuthorInfoComponent } from '@angular-love/blog/authors/ui-author-info';
import { BreadcrumbComponent } from '@angular-love/blog/shared/ui-breadcrumb';
import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';
import { InfiniteScrollTriggerDirective } from '@angular-love/blog/shared/ui-pagination';
import { SocialMediaIconsComponent } from '@angular-love/blog/shared/ui-social-media-icons';
import { NewsletterComponent } from '@angular-love/newsletter';

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
    AuthorInfoComponent,
    InfiniteScrollTriggerDirective,
  ],
  templateUrl: './feature-about-us.component.html',
  styleUrl: './feature-about-us.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AuthorListStore],
})
export class FeatureAboutUsComponent implements OnInit {
  private readonly _authorListStore = inject(AuthorListStore);
  readonly authors = this._authorListStore.authors;

  noAuthorsInView = computed(() => {
    return this.authors()?.length || 0;
  });

  private readonly _skip = this._authorListStore.skip;
  private readonly _total = this._authorListStore.total;
  private readonly _pageSize = this._authorListStore.pageSize;

  ngOnInit(): void {
    if (this.authors().length === 0) {
      this._authorListStore.fetchAuthorList({
        take: this._pageSize(),
        skip: 0,
      });
    }
  }

  loadPage(): void {
    if (this._skip() <= this._total()) {
      this._authorListStore.fetchAuthorList({
        take: this._pageSize(),
        skip: this._skip() + this._pageSize(),
      });
    }
  }
}

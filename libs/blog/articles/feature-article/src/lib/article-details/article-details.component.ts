import { DatePipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';

import { GiscusCommentsComponent } from '@angular-love/blog/articles/feature-comments';
import { RelatedArticlesComponent } from '@angular-love/blog/articles/feature-related-articles';
import { ArticleCompactCardSkeletonComponent } from '@angular-love/blog/articles/ui-article-card';
import { ArticleContentComponent } from '@angular-love/blog/articles/ui-article-content';
import {
  TableOfContentsComponent,
  TableOfContentsScrollSpyDirective,
} from '@angular-love/blog/articles/ui-table-of-contents';
import { AuthorCardComponent } from '@angular-love/blog/authors/ui-author-card';
import { NewsletterComponent } from '@angular-love/blog/newsletter';
import {
  CardComponent,
  CardContentDirective,
  DarkCardDirective,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';
import { UiDifficultyComponent } from '@angular-love/blog/shared/ui-difficulty';
import {
  Article,
  articleLangToLocaleMap,
} from '@angular-love/contracts/articles';
import { RepeatDirective } from '@angular-love/utils';

import { ArticleShareIconsComponent } from '../article-share-icons/article-share-icons.component';

@Component({
  selector: 'al-article-details',
  imports: [
    DatePipe,
    ArticleContentComponent,
    GradientCardDirective,
    NewsletterComponent,
    CardContentDirective,
    AuthorCardComponent,
    DarkCardDirective,
    TableOfContentsComponent,
    TableOfContentsScrollSpyDirective,
    GiscusCommentsComponent,
    CardComponent,
    UiDifficultyComponent,
    ArticleShareIconsComponent,
    NgClass,
    FastSvgComponent,
    RelatedArticlesComponent,
    ArticleCompactCardSkeletonComponent,
    RepeatDirective,
  ],
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleDetailsComponent {
  readonly articleDetails = input.required<Article>();
  protected readonly adBannerStoreVisible = signal(false);

  readonly locale = computed(
    () => articleLangToLocaleMap[this.articleDetails().language],
  );
}

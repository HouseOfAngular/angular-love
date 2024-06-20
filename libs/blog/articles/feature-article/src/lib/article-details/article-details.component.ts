import { DatePipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { AdBannerStore } from '@angular-love/blog/ad-banner/data-access';
import { GiscusCommentsComponent } from '@angular-love/blog/articles/feature-comments';
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
  CardSkeletonComponent,
  DarkCardDirective,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';
import { UiDifficultyComponent } from '@angular-love/blog/shared/ui-difficulty';
import { IconComponent } from '@angular-love/blog/shared/ui-icon';
import { Article } from '@angular-love/contracts/articles';

import { ArticleShareIconsComponent } from '../article-share-icons/article-share-icons.component';

@Component({
  selector: 'al-article-details',
  standalone: true,
  imports: [
    DatePipe,
    IconComponent,
    ArticleContentComponent,
    GradientCardDirective,
    NewsletterComponent,
    CardContentDirective,
    AuthorCardComponent,
    DarkCardDirective,
    TableOfContentsComponent,
    TableOfContentsScrollSpyDirective,
    CardSkeletonComponent,
    GiscusCommentsComponent,
    CardComponent,
    UiDifficultyComponent,
    ArticleShareIconsComponent,
    NgClass,
  ],
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleDetailsComponent {
  articleDetails = input.required<Article>();
  protected readonly adBannerStoreVisible =
    inject(AdBannerStore).adBannerVisible;
}

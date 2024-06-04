import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { GiscusCommentsComponent } from '@angular-love/blog/articles/feature-comments';
import { ArticleContentComponent } from '@angular-love/blog/articles/ui-article-content';
import {
  TableOfContentsComponent,
  TableOfContentsScrollSpyDirective,
} from '@angular-love/blog/articles/ui-table-of-contents';
import { AuthorCardComponent } from '@angular-love/blog/authors/ui-author-card';
import {
  CardComponent,
  CardContentDirective,
  CardSkeletonComponent,
  DarkCardDirective,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui-card';
import { IconComponent } from '@angular-love/blog/shared/ui-icon';
import { Article } from '@angular-love/contracts/articles';
import { NewsletterComponent } from '@angular-love/newsletter';

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
  ],
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleDetailsComponent {
  articleDetails = input.required<Article>();
}

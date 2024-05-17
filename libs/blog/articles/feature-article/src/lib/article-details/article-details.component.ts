import { DatePipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AuthorCardComponent } from '@angular-love/blog/authors/ui-author-card';
import { SocialMediaIconsComponent } from '@angular-love/blog/shared/ui-social-media-icons';
import { Article } from '@angular-love/contracts/articles';

import { ArticleContentComponent } from '../article-content/article-content.component';

@Component({
  selector: 'al-article-details',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    SocialMediaIconsComponent,
    AuthorCardComponent,
    ArticleContentComponent,
  ],
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleDetailsComponent {
  @Input() articleDetails: Article | null = null;
}

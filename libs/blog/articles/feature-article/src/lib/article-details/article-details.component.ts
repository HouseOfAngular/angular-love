import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { AuthorCardComponent } from '@angular-love/blog/authors/ui-card';
import { SocialMediaIconsComponent } from '@angular-love/blog/shared/ui/social-media-icons';
import { ArticleContentComponent } from '../article-content/article-content.component';
import { Article } from '@angular-love/blog/articles/data-access';

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

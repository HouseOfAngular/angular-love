import { Component, Input } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { Article } from '@angular-love/blog/articles/data-access';
import { SocialMediaIconsComponent } from '@angular-love/blog/shared/ui/social-media-icons';
import { AuthorCardComponent } from '@angular-love/blog/authors/ui-card';
import { ArticleContentComponent } from './article-content/article-content.component';

@Component({
  selector: 'al-blog-articles-feature-item',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    SocialMediaIconsComponent,
    AuthorCardComponent,
    ArticleContentComponent,
  ],
  templateUrl: './blog-articles-feature-item.component.html',
  styleUrl: './blog-articles-feature-item.component.scss',
})
export class BlogArticlesFeatureItemComponent {
  @Input() article?: Article;
}

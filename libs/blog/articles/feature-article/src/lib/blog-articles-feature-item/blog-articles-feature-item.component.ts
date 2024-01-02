import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { SocialMediaIconsComponent } from '@angular-love/blog/shared/ui/social-media-icons';
import { AuthorCardComponent } from '@angular-love/blog/authors/ui-card';
import { ArticleContentComponent } from './article-content/article-content.component';
import {
  Article,
  ArticleDetailsSignalStore,
} from '@angular-love/blog/articles/data-access';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'al-blog-articles-feature-item',
  imports: [
    NgIf,
    DatePipe,
    SocialMediaIconsComponent,
    AuthorCardComponent,
    ArticleContentComponent,
  ],
  templateUrl: './blog-articles-feature-item.component.html',
  styleUrl: './blog-articles-feature-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class BlogArticlesFeatureItemComponent {
  private readonly articleDetailsSignalStore = inject(
    ArticleDetailsSignalStore
  );
  private readonly slug = inject(ActivatedRoute).snapshot.paramMap.get('slug')!;

  readonly isFetchArticleDetailsLoading: Signal<boolean> =
    this.articleDetailsSignalStore.isFetchArticleDetailsLoading;
  readonly articleDetails: Signal<Article | null> =
    this.articleDetailsSignalStore.articleDetails;

  constructor() {
    this.articleDetailsSignalStore.fetchArticleDetails({ slug: this.slug });
  }
}

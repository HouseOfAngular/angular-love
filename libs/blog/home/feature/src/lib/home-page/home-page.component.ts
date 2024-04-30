import { ArticleCardDataModel } from '@angular-love/article-card-data-model';
import { ArticlesListContainerComponent } from '@angular-love/blog/articles/feature-list';
import { PartnersComponent } from '@angular-love/blog/partners/ui/partners';
import { FeatureSearchComponent } from '@angular-love/blog/search/feature-search';
import { CardComponent } from '@angular-love/blog/shared/ui/card';
import { NewsletterComponent } from '@angular-love/newsletter';
import { UiArticleCardComponent } from '@angular-love/ui-article-card';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'al-home-page',
  standalone: true,
  imports: [
    ArticlesListContainerComponent,
    NewsletterComponent,
    FeatureSearchComponent,
    ReactiveFormsModule,
    CardComponent,
    ArticlesListContainerComponent,
    NewsletterComponent,
    PartnersComponent,
    UiArticleCardComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private readonly route = inject(ActivatedRoute);

  card: ArticleCardDataModel = {
    author: {
      avatarUrl: 'assets/mock-avatar.png',
      name: 'Test',
    },
    excerpt: 'bla bla ',
    featuredImageUrl: 'assets/mock-avatar.png',
    publishDate: '22.05.05',
    readingTime: 3,
    slug: 'slug',
    title: 'My title',
  };

  isSearchOpen = toSignal<boolean>(
    this.route.queryParamMap.pipe(
      map((map) => {
        return map.get('isSearchOpen') === 'true' || false;
      }),
    ),
  );
}

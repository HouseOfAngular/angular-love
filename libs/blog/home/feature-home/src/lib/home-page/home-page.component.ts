import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { ArticlesListContainerComponent } from '@angular-love/blog/articles/feature-list';
import { UiArticleCardComponent } from '@angular-love/blog/articles/ui-article-card';
import { PartnersComponent } from '@angular-love/blog/partners/ui-partners';
import { FeatureSearchComponent } from '@angular-love/blog/search/feature-search';
import { CardComponent } from '@angular-love/blog/shared/ui-card';
import { FeatureLatestArticlesComponent } from '@angular-love/feature-latest-articles';
import { NewsletterComponent } from '@angular-love/newsletter';

@Component({
  selector: 'al-home-page',
  standalone: true,
  imports: [
    NewsletterComponent,
    FeatureSearchComponent,
    ReactiveFormsModule,
    CardComponent,
    NewsletterComponent,
    PartnersComponent,
    FeatureLatestArticlesComponent,
    UiArticleCardComponent,
    ArticlesListContainerComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private readonly route = inject(ActivatedRoute);

  isSearchOpen = toSignal<boolean>(
    this.route.queryParamMap.pipe(
      map((map) => {
        return map.get('isSearchOpen') === 'true' || false;
      }),
    ),
  );
}

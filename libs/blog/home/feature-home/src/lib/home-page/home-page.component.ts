import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ArticlesListContainerComponent } from '@angular-love/blog/articles/feature-list';
import { UiArticleCardComponent } from '@angular-love/blog/articles/ui-article-card';
import { PartnersComponent } from '@angular-love/blog/partners/ui-partners';
import { CardComponent } from '@angular-love/blog/shared/ui-card';
import { FeatureLatestArticlesComponent } from '@angular-love/feature-latest-articles';
import { FeatureRecommendedArticlesComponent } from '@angular-love/feature-recommended-articles';
import { NewsletterComponent } from '@angular-love/newsletter';

@Component({
  selector: 'al-home-page',
  standalone: true,
  imports: [
    NewsletterComponent,
    ReactiveFormsModule,
    CardComponent,
    NewsletterComponent,
    PartnersComponent,
    FeatureLatestArticlesComponent,
    FeatureRecommendedArticlesComponent,
    UiArticleCardComponent,
    ArticlesListContainerComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}

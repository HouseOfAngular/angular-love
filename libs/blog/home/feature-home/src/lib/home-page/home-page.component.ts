import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ArticlesListContainerComponent } from '@angular-love/blog/articles/feature-list';
import { UiArticleCardComponent } from '@angular-love/blog/articles/ui-article-card';
import { UiMainPartnerComponent } from '@angular-love/blog/main-partner/ui-main-partner';
import { NewsletterComponent } from '@angular-love/blog/newsletter';
import { PartnersComponent } from '@angular-love/blog/partners/ui-partners';
import { CardComponent } from '@angular-love/blog/shared/ui-card';
import { FeatureLatestArticlesComponent } from '@angular-love/feature-latest-articles';

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
    UiArticleCardComponent,
    ArticlesListContainerComponent,
    UiMainPartnerComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}

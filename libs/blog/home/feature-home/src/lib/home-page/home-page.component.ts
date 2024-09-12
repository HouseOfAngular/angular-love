import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { map } from 'rxjs';

import { ArticlesListContainerComponent } from '@angular-love/blog/articles/feature-list';
import { UiArticleCardComponent } from '@angular-love/blog/articles/ui-article-card';
import { NewsletterComponent } from '@angular-love/blog/newsletter';
import { PartnersComponent } from '@angular-love/blog/partners/ui-partners';
import { AdImageBannerComponent } from '@angular-love/blog/shared/ad-banner';
import { CardComponent } from '@angular-love/blog/shared/ui-card';
import { FeatureLatestArticlesComponent } from '@angular-love/feature-latest-articles';

import { hoaHireUs, partnersList } from './partners';

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
    AdImageBannerComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  protected readonly hoaHireUs = hoaHireUs;
  protected readonly partnersList = partnersList;
  private readonly _translocoService = inject(TranslocoService);

  readonly banner = toSignal(
    this._translocoService.langChanges$.pipe(
      map((activeLang) => ({
        url: 'assets/AL-AID-banner.png',
        alt: 'Banner - Two blogs join forces',
        slug:
          activeLang === 'en'
            ? 'angular-love-joins-forces-with-angular-in-depth-to-bring-you-the-best-angular-on-the-web'
            : 'laczymy-sily-z-angular-in-depth-by-dostarczyc-wam-najlepsze-tresci-o-angularze',
      })),
    ),
  );
}

import { ArticlesListContainerComponent } from '@angular-love/blog/articles/feature-list';
import { PartnersComponent } from '@angular-love/blog/partners/ui/partners';
import { BlogSearchFeatureSearchComponent } from '@angular-love/blog/search/feature-search';
import { CardComponent } from '@angular-love/blog/shared/ui/card';
import { NewsletterComponent } from '@angular-love/newsletter';
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
    BlogSearchFeatureSearchComponent,
    ReactiveFormsModule,
    CardComponent,
    ArticlesListContainerComponent,
    NewsletterComponent,
    PartnersComponent,
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
        return map.get('isSearchOpen') === 'true' || true;
      }),
    ),
  );
}

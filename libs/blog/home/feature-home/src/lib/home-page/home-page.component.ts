import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ArticlesListContainerComponent } from '@angular-love/blog/articles/feature-list';
import { PartnersComponent } from '@angular-love/blog/partners/ui-partners';
import { FeatureLatestArticlesComponent } from '@angular-love/feature-latest-articles';

import { hoaHireUs, partnersList } from './partners';
import { WelcomeMessageComponent } from './welcome-message/welcome-message.component';

@Component({
  selector: 'al-home-page',
  imports: [
    ReactiveFormsModule,
    PartnersComponent,
    FeatureLatestArticlesComponent,
    ArticlesListContainerComponent,
    WelcomeMessageComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  protected readonly hoaHireUs = hoaHireUs;
  protected readonly partnersList = partnersList;
}

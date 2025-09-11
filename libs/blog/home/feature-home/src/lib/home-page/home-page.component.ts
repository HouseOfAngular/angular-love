import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ArticlesListContainerComponent } from '@angular-love/blog/articles/feature-list';
<<<<<<< HEAD
=======
import { PartnersComponent } from '@angular-love/blog/partners/ui-partners';
import { VideosListContainerComponent } from '@angular-love/blog/videos/feature-list';
>>>>>>> 6941c93 (feat(angular-talks): add angular talks list)
import { FeatureLatestArticlesComponent } from '@angular-love/feature-latest-articles';

import { WelcomeMessageComponent } from './welcome-message/welcome-message.component';

@Component({
  selector: 'al-home-page',
  imports: [
    ReactiveFormsModule,
    FeatureLatestArticlesComponent,
    ArticlesListContainerComponent,
    WelcomeMessageComponent,
    VideosListContainerComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BreadcrumbComponent } from '@angular-love/blog/shared/ui-breadcrumb';

import { BecomeAuthorBenefitsComponent } from '../components/become-author-benefits/become-author-benefits.component';
import { BecomeAuthorImprovementsComponent } from '../components/become-author-improvements/become-author-improvements.component';

@Component({
  selector: 'al-feature-become-author-page',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    BecomeAuthorBenefitsComponent,
    BecomeAuthorImprovementsComponent,
  ],
  templateUrl: './become-author-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BecomeAuthorPageFeatureComponent {
  protected readonly improvements = [
    'Increase your visibility in social media and present yourself as an Angular Expert by writing articles.',
    'Develop the Angular Community, and yourself by sharing your knowledge. Working on an article requires research and a full understanding of the issue.',
    'And also… get access to benefits such as discounts on courses, goodies, and much more – we try to support angular.love bloggers.',
  ];

  protected readonly benefits = [
    'By sharing your knowledge you inspire other Developers.',
    'By teaching someone, you develop your own skills, not only technical ones.',
    'New experiences allow you to broaden your horizons.',
    'You will strengthen your personal brand.',
    'You will get discounts on conferences, courses and free goodies.',
  ];
}

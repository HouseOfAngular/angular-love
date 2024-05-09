import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  BecomeAuthorData,
  UiBecomeAuthorDataSectionComponent,
} from '@angular-love/ui-become-author-data-section';

export const dataMock: Array<BecomeAuthorData> = [
  {
    title: 'Why is it worth it?',
    description:
      'Angular.love is one of the biggest and most popular polish blogs about Angular. We are expanding and rapidly growing, which can be proved by the fact that our blog has over 4000 unique visitors every month (from Poland and abroad) and more than 2100 followers on Facebook.\n\nOur mission is to inspire, educate, spread good practices and share knowledge among Developers. Every 2 months we also organize Angular Meetups in Warsaw, during which the speakers present different, angular-related topics and share their knowledge among others. Our content is free and available for everyone – we want to make the Angular Community grow! Ok, but what’s in it for you?',

    depictions: [
      'Increase your visibility in social media and present yourself as an Angular Expert by writing articles.',
      'Develop the Angular Community, and yourself by sharing your knowledge. Working on an article requires research and a full understanding of the issue.',
      'And also… get access to benefits such as discounts on courses, goodies, and much more – we try to support angular.love bloggers.',
    ],
  },
  {
    title: 'How will you develop through this?',
    depictions: [
      'By sharing your knowledge you inspire other Developers.',
      'By teaching someone, you develop your own skills, not only technical ones.',
      'New experiences allow you to broaden your horizons.',
      'You will strengthen your personal brand.',
      'You will get discounts on conferences, courses and free goodies.',
    ],
  },
];

@Component({
  selector: 'al-become-author-page-feature',
  standalone: true,
  imports: [UiBecomeAuthorDataSectionComponent],
  templateUrl: './become-author-page-feature.component.html',
  styleUrl: './become-author-page-feature.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BecomeAuthorPageFeatureComponent {
  protected dataSource = signal(dataMock);
}

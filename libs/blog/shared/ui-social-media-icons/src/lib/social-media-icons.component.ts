import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  SocialMediaIconItemComponent,
  SocialMediaIconItemUi,
} from './social-media-icon-item.component';

@Component({
  standalone: true,
  selector: 'al-social-media-icons',
  templateUrl: './social-media-icons.component.html',
  styleUrls: ['./social-media-icons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SocialMediaIconItemComponent],
})
export class SocialMediaIconsComponent {
  readonly socials: SocialMediaIconItemUi[] = [
    {
      usernameOrPageId: 'www.angular.love',
      iconName: 'facebook',
      ariaLabel: 'Like our Facebook page',
    },
    {
      usernameOrPageId: 'AngularLovePL',
      iconName: 'twitter-x',
      ariaLabel: 'Follow us on Twitter',
    },
    {
      usernameOrPageId: 'angular-love',
      iconName: 'linkedIn',
      ariaLabel: 'Follow us on LinkedIn',
      isCompany: true,
    },
    {
      usernameOrPageId: '@angularlove',
      iconName: 'youtube',
      ariaLabel: 'Watch our YouTube videos',
    },
  ];
}

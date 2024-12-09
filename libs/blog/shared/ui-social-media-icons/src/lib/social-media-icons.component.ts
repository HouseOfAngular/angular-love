import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import {
  SocialMediaIconItemComponent,
  SocialMediaIconItemUi,
} from './social-media-icon-item.component';

@Component({
  selector: 'al-social-media-icons',
  templateUrl: './social-media-icons.component.html',
  styleUrls: ['./social-media-icons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SocialMediaIconItemComponent],
})
export class SocialMediaIconsComponent {
  private _transloco = inject(TranslocoService);

  readonly socials: SocialMediaIconItemUi[] = [
    {
      usernameOrPageId: 'www.angular.love',
      iconName: 'facebook',
      ariaLabel: 'socialLinks.facebook',
    },
    {
      usernameOrPageId: 'AngularLovePL',
      iconName: 'twitter-x',
      ariaLabel: 'socialLinks.twitter-x',
    },
    {
      usernameOrPageId: 'angular-love',
      iconName: 'linkedIn',
      ariaLabel: 'socialLinks.linkedIn',
      isCompany: true,
    },
    {
      usernameOrPageId: '@angularlove',
      iconName: 'youtube',
      ariaLabel: 'socialLinks.youtube',
    },
  ];
}

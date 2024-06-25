import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

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
  private _transloco = inject(TranslocoService);

  readonly socials: SocialMediaIconItemUi[] = [
    {
      usernameOrPageId: 'www.angular.love',
      iconName: 'facebook',
      ariaLabel: this._transloco.translate('socialLinks.facebook'),
    },
    {
      usernameOrPageId: 'AngularLovePL',
      iconName: 'twitter-x',
      ariaLabel: this._transloco.translate('socialLinks.twitter-x'),
    },
    {
      usernameOrPageId: 'angular-love',
      iconName: 'linkedIn',
      ariaLabel: this._transloco.translate('socialLinks.linkedIn'),
      isCompany: true,
    },
    {
      usernameOrPageId: '@angularlove',
      iconName: 'youtube',
      ariaLabel: this._transloco.translate('socialLinks.youtube'),
    },
  ];
}

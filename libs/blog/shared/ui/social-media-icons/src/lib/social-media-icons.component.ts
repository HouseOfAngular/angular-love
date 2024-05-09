import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IconComponent, IconType } from '@angular-love/icon';

export type IconConfig = {
  href: string;
  name: IconType;
};

@Component({
  standalone: true,
  selector: 'al-social-media-icons',
  templateUrl: './social-media-icons.component.html',
  styleUrls: ['./social-media-icons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class SocialMediaIconsComponent {
  readonly icons: IconConfig[] = [
    {
      href: 'https://www.facebook.com/houseofangular',
      name: 'facebook',
    },
    {
      href: 'https://twitter.com/HouseOfAngular',
      name: 'twitter-x',
    },
    {
      href: 'https://www.linkedin.com/company/house-of-angular',
      name: 'linkedIn',
    },
    {
      href: 'https://www.youtube.com/channel/UCloreiP9fdASiW9eF3BPCKQ',
      name: 'youtube',
    },
  ];
}

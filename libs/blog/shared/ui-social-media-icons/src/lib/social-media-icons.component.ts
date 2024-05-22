import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IconComponent, IconType } from '@angular-love/blog/shared/ui-icon';

export type IconConfig = {
  href: string;
  name: IconType;
  ariaLabel: string;
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
      href: 'https://www.facebook.com/www.angular.love',
      name: 'facebook',
      ariaLabel: 'Like our Facebook page',
    },
    {
      href: 'https://x.com/AngularLovePL',
      name: 'twitter-x',
      ariaLabel: 'Follow us on Twitter',
    },
    {
      href: 'https://www.linkedin.com/company/angular-love',
      name: 'linkedIn',
      ariaLabel: 'Follow us on LinkedIn',
    },
    {
      href: 'https://www.youtube.com/@angularlove',
      name: 'youtube',
      ariaLabel: 'Watch our YouTube videos',
    },
  ];
}

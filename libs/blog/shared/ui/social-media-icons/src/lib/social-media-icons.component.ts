import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  tablerBrandFacebook,
  tablerBrandLinkedin,
  tablerBrandTwitter,
  tablerBrandYoutube,
} from '@ng-icons/tabler-icons';

export type IconConfig = {
  href: string;
  name: string;
  color: string;
};

@Component({
  standalone: true,
  selector: 'al-social-media-icons',
  templateUrl: './social-media-icons.component.html',
  styleUrls: ['./social-media-icons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIconComponent],
  providers: [
    provideIcons({
      tablerBrandTwitter,
      tablerBrandFacebook,
      tablerBrandYoutube,
      tablerBrandLinkedin,
    }),
  ],
})
export class SocialMediaIconsComponent {
  size = input('24');

  readonly icons: IconConfig[] = [
    { href: '/', color: 'white', name: 'tablerBrandFacebook' },
    { href: '/', color: 'white', name: 'tablerBrandTwitter' },
    { href: '/', color: 'white', name: 'tablerBrandLinkedin' },
    { href: '/', color: 'white', name: 'tablerBrandYoutube' },
  ];
}

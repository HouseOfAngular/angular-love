import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import {
  SocialMediaIconItemComponent,
  SocialMediaIconItemUi,
} from './social-media-icon-item.component';

export type SocialMediaIconsVariant = 'light' | 'dark' | 'default';

@Component({
  selector: 'al-social-media-icons',
  templateUrl: './social-media-icons.component.html',
  styleUrls: ['./social-media-icons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SocialMediaIconItemComponent],
})
export class SocialMediaIconsComponent {
  private _transloco = inject(TranslocoService);

  variant = input<SocialMediaIconsVariant>('default');

  readonly iconColorClass = computed(() => {
    return this.variant() === 'default'
      ? 'text-al-primary-foreground'
      : this.variant() === 'light'
        ? 'text-[#fff]'
        : 'text-[#000]';
  });

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

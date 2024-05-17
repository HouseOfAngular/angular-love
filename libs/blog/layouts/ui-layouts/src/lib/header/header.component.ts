import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NavigationComponent } from '@angular-love/blog/layouts/ui-navigation';
import { IconComponent } from '@angular-love/blog/shared/ui-icon';
import { SocialMediaIconsComponent } from '@angular-love/blog/shared/ui-social-media-icons';

@Component({
  standalone: true,
  selector: 'al-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgOptimizedImage,
    SocialMediaIconsComponent,
    RouterLinkActive,
    RouterLink,
    NavigationComponent,
    IconComponent,
  ],
})
export class HeaderComponent {
  language = input.required<'PL' | 'ENG'>();

  readonly logoSize = '40';
}

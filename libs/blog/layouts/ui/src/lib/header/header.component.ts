import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { SocialMediaIconsComponent } from '@angular-love/blog/shared/ui/social-media-icons';
import { IconComponent } from '@angular-love/icon';
import { NavigationComponent } from '@angular-love/navigation';

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

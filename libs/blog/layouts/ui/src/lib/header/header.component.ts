import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';

import { SocialMediaIconsComponent } from '@angular-love/blog/shared/ui/social-media-icons';
import { NavigationComponent } from '@angular-love/navigation';

@Component({
  standalone: true,
  selector: 'al-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgOptimizedImage,
    NgIconComponent,
    SocialMediaIconsComponent,
    RouterLinkActive,
    RouterLink,
    NavigationComponent,
  ],
  providers: [provideIcons({ heroMagnifyingGlass })],
})
export class HeaderComponent {
  language = input.required<'PL' | 'ENG'>();

  readonly logoSize = '40';

  openSearch(): void {
    // TODO: JIRA issue https://valueadd.atlassian.net/browse/KAP-1
    alert('To be done');
  }
}

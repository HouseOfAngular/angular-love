import { NgClass, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { LocalizeRouterModule } from '@penleychan/ngx-transloco-router';

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
    NgClass,
    TranslocoDirective,
    LocalizeRouterModule,
  ],
})
export class HeaderComponent {
  language = input.required<string>();

  languageChange = output<string>();

  showNav = signal<boolean>(false);

  readonly logoSize = '40';

  toggleNav(): void {
    this.showNav.set(!this.showNav());
  }
}

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';

import { NavigationComponent } from '@angular-love/blog/layouts/ui-navigation';
import { SocialMediaIconsComponent } from '@angular-love/blog/shared/ui-social-media-icons';

@Component({
  selector: 'al-footer',
  standalone: true,
  imports: [
    NgIconComponent,
    SocialMediaIconsComponent,
    NavigationComponent,
    NgOptimizedImage,
  ],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}

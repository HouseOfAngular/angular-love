import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';

import { NavigationComponent } from '@angular-love/blog/layouts/ui-navigation';
import { SocialMediaIconsComponent } from '@angular-love/blog/shared/ui-social-media-icons';

import { FooterLogoComponent } from './components/footer-logo.component';
import { FooterSocialMediaIconsComponent } from './components/footer-social-media-icons.component';

@Component({
  selector: 'al-footer',
  standalone: true,
  imports: [
    NgIconComponent,
    SocialMediaIconsComponent,
    NavigationComponent,
    NgOptimizedImage,
    FooterLogoComponent,
    FooterSocialMediaIconsComponent,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}

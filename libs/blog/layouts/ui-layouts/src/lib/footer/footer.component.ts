import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NavigationComponent } from '@angular-love/blog/layouts/ui-navigation';

import { FooterLogoComponent } from './components/footer-logo.component';
import { FooterSocialMediaIconsComponent } from './components/footer-social-media-icons.component';

@Component({
  selector: 'al-footer',
  imports: [
    NavigationComponent,
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

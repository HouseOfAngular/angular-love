import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroBookmark,
  heroBookOpen,
  heroNewspaper,
  heroRocketLaunch,
} from '@ng-icons/heroicons/outline';
import {
  tablerBrandFacebook,
  tablerBrandTwitter,
  tablerBrandYoutube,
} from '@ng-icons/tabler-icons';
import { SocialMediaIconsComponent } from '@angular-love/blog/shared/ui/social-media-icons';

@Component({
  selector: 'angular-love-footer',
  standalone: true,
  imports: [NgIconComponent, SocialMediaIconsComponent],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      heroBookOpen,
      heroBookmark,
      heroRocketLaunch,
      heroNewspaper,
      tablerBrandTwitter,
      tablerBrandFacebook,
      tablerBrandYoutube,
    }),
  ],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}

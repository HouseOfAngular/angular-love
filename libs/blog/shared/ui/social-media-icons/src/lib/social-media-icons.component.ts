import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  tablerBrandFacebook,
  tablerBrandTwitter,
  tablerBrandYoutube,
} from '@ng-icons/tabler-icons';

@Component({
  standalone: true,
  selector: 'angular-love-social-media-icons',
  templateUrl: './social-icons.component.html',
  styleUrls: ['./social-icons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIconComponent],
  providers: [
    provideIcons({
      tablerBrandTwitter,
      tablerBrandFacebook,
      tablerBrandYoutube,
    }),
  ],
})
export class SocialMediaIconsComponent {
  @Input() size = '16';
}

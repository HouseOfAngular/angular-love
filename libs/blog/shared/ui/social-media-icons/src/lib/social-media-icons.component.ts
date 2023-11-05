import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  tablerBrandFacebook,
  tablerBrandTwitter,
  tablerBrandYoutube,
} from '@ng-icons/tabler-icons';

@Component({
  standalone: true,
  selector: 'al-social-media-icons',
  templateUrl: './social-media-icons.component.html',
  styleUrls: ['./social-media-icons.component.scss'],
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

import { SocialMediaIconsComponent } from '@angular-love/blog/shared/ui/social-media-icons';
import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';

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
    RouterLink,
  ],
  providers: [provideIcons({ heroMagnifyingGlass })],
})
export class HeaderComponent {
  openSearch(): void {
    alert('To be done');
  }
}

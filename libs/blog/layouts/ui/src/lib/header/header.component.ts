import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { SocialMediaIconsComponent } from '@angular-love/blog/shared/ui/social-media-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { RouterLink } from '@angular/router';

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
export class HeaderComponent {}

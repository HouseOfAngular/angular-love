import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { SocialMediaIconsComponent } from '@angular-love/blog/shared/ui/social-media-icons';
import { SearchBarComponent } from '@angular-love/blog/search/ui';

@Component({
  standalone: true,
  selector: 'angular-love-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, SocialMediaIconsComponent, SearchBarComponent],
})
export class HeaderComponent {}

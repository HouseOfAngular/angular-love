import { Component, Input } from '@angular/core';

import { AvatarComponent } from '@angular-love/blog/shared/ui/avatar';
import {
  CardComponent,
  CardContentDirective,
} from '@angular-love/blog/shared/ui/card';
import { SocialMediaIconsComponent } from '@angular-love/blog/shared/ui/social-media-icons';

export interface UiAuthorCard {
  name: string;
  description: string;
  avatarUrl: string;
}

@Component({
  selector: 'al-author-card',
  standalone: true,
  imports: [
    AvatarComponent,
    CardComponent,
    CardContentDirective,
    SocialMediaIconsComponent,
  ],
  templateUrl: './author-card.component.html',
})
export class AuthorCardComponent {
  @Input({ required: true }) author!: UiAuthorCard;
}

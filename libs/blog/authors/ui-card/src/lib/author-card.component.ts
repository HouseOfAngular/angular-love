import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AvatarComponent } from '@angular-love/blog/shared/ui/avatar';
import {
  CardComponent,
  GradientCardDirective,
} from '@angular-love/blog/shared/ui/card';

export interface UiAuthorCard {
  name: string;
  description: string;
  avatarUrl: string;
  position: string;
  slug: string;
}

@Component({
  selector: 'al-author-card',
  standalone: true,
  imports: [AvatarComponent, CardComponent, GradientCardDirective, RouterLink],
  templateUrl: './author-card.component.html',
})
export class AuthorCardComponent {
  author = input.required<UiAuthorCard>();
}

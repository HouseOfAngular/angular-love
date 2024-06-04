import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { UiAuthorCard } from '@angular-love/blog/authors/types';
import { AvatarComponent } from '@angular-love/blog/shared/ui-avatar';
import { DynamicTextClampComponent } from '@angular-love/blog/shared/ui-dynamic-text-clamp';
import {
  SocialMediaIconItemComponent,
  SocialMediaIconItemUi,
} from '@angular-love/blog/shared/ui-social-media-icons';

import { AuthorCardTemplateComponent } from './author-card-template.component';

@Component({
  selector: 'al-author-card',
  standalone: true,
  imports: [
    AuthorCardTemplateComponent,
    AvatarComponent,
    DynamicTextClampComponent,
    RouterLink,
    NgTemplateOutlet,
    SocialMediaIconItemComponent,
  ],
  templateUrl: './author-card.component.html',
  styleUrl: './author-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorCardComponent {
  author = input.required<UiAuthorCard>();

  clampText = input<boolean>();
  linkable = input<boolean>(false);

  descriptionClass = computed(
    () => 'text-sm' + (this.clampText() ? ' line-clamp-3' : ''),
  );

  socials = computed<SocialMediaIconItemUi[]>(() => {
    const { github, twitter, linkedin } = this.author();
    return [
      {
        ariaLabel: 'Follow author on Twitter',
        iconName: 'twitter-x',
        usernameOrPageId: twitter,
      },
      {
        ariaLabel: 'Follow author on LinkedIn',
        iconName: 'linkedIn',
        usernameOrPageId: linkedin,
        isCompany: false,
      },
      {
        ariaLabel: 'Follow author on GitHub',
        iconName: 'github-mark',
        usernameOrPageId: github,
      },
    ].filter(
      (social): social is SocialMediaIconItemUi =>
        social.usernameOrPageId !== null,
    );
  });
}

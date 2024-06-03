import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { UiAuthorInfo } from '@angular-love/blog/authors/types';
import { AvatarComponent } from '@angular-love/blog/shared/ui-avatar';
import { DynamicTextClampComponent } from '@angular-love/blog/shared/ui-dynamic-text-clamp';
import {
  SocialMediaIconItemComponent,
  SocialMediaIconItemUi,
} from '@angular-love/blog/shared/ui-social-media-icons';

import { AuthorInfoTemplateComponent } from './author-info-template.component';

@Component({
  selector: 'al-author-info',
  standalone: true,
  imports: [
    AuthorInfoTemplateComponent,
    AvatarComponent,
    DynamicTextClampComponent,
    RouterLink,
    NgTemplateOutlet,
    SocialMediaIconItemComponent,
  ],
  templateUrl: './author-info.component.html',
  styleUrl: './author-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorInfoComponent {
  author = input.required<UiAuthorInfo>();

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

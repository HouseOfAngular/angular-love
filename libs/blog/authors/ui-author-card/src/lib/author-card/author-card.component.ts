import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

import { UiAuthorCard } from '@angular-love/blog/authors/types';
import { AlLocalizePipe } from '@angular-love/blog/i18n/util';
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
    AlLocalizePipe,
  ],
  templateUrl: './author-card.component.html',
  styleUrl: './author-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-testid': 'author-card',
    '[attr.id]': 'author().slug',
  },
})
export class AuthorCardComponent {
  author = input.required<UiAuthorCard>();

  clampText = input<boolean>();
  linkable = input<boolean>(false);

  descriptionClass = computed(
    () => 'text-sm' + (this.clampText() ? ' line-clamp-3' : ''),
  );

  private readonly _authorTitlesTranslations = inject(
    TranslocoService,
  ).translateObject('authorCard.titles') as { [titleKey: string]: string };
  readonly authorTitles = computed(
    () =>
      this.author()
        ?.titles.reduce((titlesList, titleKey) => {
          // skip titles without translation (e.g. 'hoa')
          return this._authorTitlesTranslations[titleKey]
            ? titlesList.concat(this._authorTitlesTranslations[titleKey])
            : titlesList;
        }, [] as string[])
        .join(', ') ?? '',
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

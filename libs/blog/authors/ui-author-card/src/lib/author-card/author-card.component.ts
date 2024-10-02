import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

import { AuthorTitle } from '@angular-love/blog/contracts/authors';
import { AlLocalizePipe } from '@angular-love/blog/i18n/util';
import { AvatarComponent } from '@angular-love/blog/shared/ui-avatar';
import {
  SocialMediaIconItemComponent,
  SocialMediaIconItemUi,
} from '@angular-love/blog/shared/ui-social-media-icons';

import { UiAuthorCard } from './author-card-data-model';
import { AuthorCardTemplateComponent } from './author-card-template.component';

@Component({
  selector: 'al-author-card',
  standalone: true,
  imports: [
    AuthorCardTemplateComponent,
    AvatarComponent,
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
  readonly author = input.required<UiAuthorCard>();
  readonly linkable = input<boolean>(false);

  private readonly _authorTitlesTranslations = inject(
    TranslocoService,
  ).translateObject('authorCard.titles') as {
    [titleKey in AuthorTitle]: string;
  };
  readonly authorTitles = computed(
    () =>
      this.author()
        ?.titles.map((titleKey) => this._authorTitlesTranslations[titleKey])
        // skip titles without translation (e.g. 'hoa')
        .filter(Boolean)
        .join(', ') ?? '',
  );

  protected readonly socials = computed<SocialMediaIconItemUi[]>(() => {
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

  private readonly _domSanitizer = inject(DomSanitizer);

  private sanitize(val: string): string {
    return this._domSanitizer.sanitize(SecurityContext.HTML, val) || '';
  }

  readonly sanitizedDescription = computed<{ description: string }>(() => ({
    description: this.sanitize(this.author().description),
  }));
}

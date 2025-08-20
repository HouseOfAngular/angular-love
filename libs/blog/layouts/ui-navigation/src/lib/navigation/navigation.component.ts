import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { AlLocalizePipe } from '@angular-love/blog/i18n/util';

export type NavItem = {
  translationPath: string;
  link: string[];
  dataTestId: string;
  externalLink?: boolean;
  showElement?: boolean;
};

@Component({
  selector: 'al-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslocoDirective,
    AlLocalizePipe,
    NgClass,
  ],
})
export class NavigationComponent {
  readonly layout = input<'vertical' | 'horizontal'>('horizontal');
  readonly whiteFont = input<boolean>(false);
  showNewsletter = input(true);

  readonly filteredNavItems = computed(() => {
    return this.navItems.filter(
      (item) =>
        item.translationPath !== 'nav.newsletter' || this.showNewsletter(),
    );
  });

  readonly navItems: NavItem[] = [
    {
      translationPath: 'nav.about',
      link: ['about-us'],
      dataTestId: 'navigation-about-us',
    },
    {
      translationPath: 'nav.meetups',
      link: ['https://meetup.angular.love/'],
      externalLink: true,
      dataTestId: 'navigation-meetups',
    },
    {
      translationPath: 'nav.become_author',
      link: ['become-author'],
      dataTestId: 'navigation-become-author',
    },
    {
      translationPath: 'nav.roadmap',
      link: ['roadmap'],
      dataTestId: 'navigation-roadmap',
    },
    {
      translationPath: 'nav.newsletter',
      link: ['newsletter'],
      dataTestId: 'navigation-newsletter',
    },
  ];
  protected navigated = output();
}

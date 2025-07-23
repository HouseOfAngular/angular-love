import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
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
};

@Component({
  selector: 'al-navigation',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass,
    TranslocoDirective,
    AlLocalizePipe,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  readonly layout = input<'vertical' | 'horizontal'>('horizontal');

  readonly navItems: NavItem[] = [
    {
      translationPath: 'nav.about',
      link: ['about-us'],
      dataTestId: 'navigation-about-us',
    },
    {
      translationPath: 'nav.meetups',
      link: ['https://meetup.angular.love/spring-camp-2025/'],
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
  ];
  protected navigated = output();
}

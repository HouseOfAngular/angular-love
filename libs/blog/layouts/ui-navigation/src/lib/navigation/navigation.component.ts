import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

export type NavItem = {
  translationPath: string;
  link: string[];
  dataTestId: string;
  externalLink?: boolean;
};

@Component({
  selector: 'al-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, TranslocoDirective],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  layout = input<'vertical' | 'horizontal'>('horizontal');
  navigated = output();

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
  ];
}

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LocalizeRouterModule } from '@penleychan/ngx-transloco-router';

export type NavItem = {
  title: string;
  link: string[];
  ariaLabel: string;
  externalLink?: boolean;
};

@Component({
  selector: 'al-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, LocalizeRouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  layout = input<'vertical' | 'horizontal'>('horizontal');

  readonly navItems: NavItem[] = [
    {
      title: 'About us',
      link: ['about-us'],
      ariaLabel: 'Navigate to about us page',
    },
    {
      title: 'Angular Meetups',
      link: ['https://meetup.angular.love/'],
      ariaLabel: 'Navigate to Angular meetups page',
      externalLink: true,
    },
    {
      title: 'Become an author',
      link: ['become-author'],
      ariaLabel: 'Navigate to become an author page',
    },
  ];
}

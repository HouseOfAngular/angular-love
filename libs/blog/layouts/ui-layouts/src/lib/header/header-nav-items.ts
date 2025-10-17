import { NavItem } from '@angular-love/blog/layouts/ui-navigation';

export const headerNavItems: NavItem[] = [
  {
    translationPath: 'nav.guides',
    link: ['guides'],
    dataTestId: 'navigation-guides',
  },
  {
    translationPath: 'nav.news',
    link: ['news'],
    dataTestId: 'navigation-news',
  },
  {
    translationPath: 'nav.meetups',
    link: ['https://meetup.angular.love/autumn-camp-2025/'],
    externalLink: true,
    dataTestId: 'navigation-meetups',
  },
  {
    translationPath: 'nav.roadmap',
    link: ['roadmap'],
    dataTestId: 'navigation-roadmap',
  },
] as const;

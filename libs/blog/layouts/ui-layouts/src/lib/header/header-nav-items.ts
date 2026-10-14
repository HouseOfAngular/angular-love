import { NavItem } from '@angular-love/blog/layouts/ui-navigation';

export const headerNavItems: NavItem[] = [
  {
    translationPath: 'nav.aiNews',
    link: ['ai-news'],
    dataTestId: 'navigation-ai-news',
  },
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
    link: ['https://meetup.angular.love/'],
    externalLink: true,
    dataTestId: 'navigation-meetups',
  },
] as const;

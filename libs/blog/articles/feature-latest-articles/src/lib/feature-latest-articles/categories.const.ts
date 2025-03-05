export const CATEGORIES_LIST = [
  {
    name: 'All',
    link: 'latest',
    slug: null,
    translationPath: 'categories.all',
  },
  {
    name: 'Guides',
    link: 'guides',
    slug: 'guides',
    translationPath: 'categories.guides',
  },
  {
    name: 'News',
    link: 'news',
    slug: 'news',
    translationPath: 'categories.news',
  },
  {
    name: 'In-Depth',
    link: 'angular-in-depth',
    slug: 'angular-in-depth',
    translationPath: 'categories.inDepth',
  },
] as const;

export type CategoryListItem = (typeof CATEGORIES_LIST)[number];

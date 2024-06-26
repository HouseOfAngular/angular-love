import type { Page } from '@playwright/test';

import { createCategoryContainer } from '../elements/category-container.element';
import { createNewsletterElement } from '../elements/newsletter.element';

export const createHomePage = (page: Page) => {
  const latestArticlesContainer = page.getByTestId('latest-articles-container');

  const latestArticles = {
    container: latestArticlesContainer,
    cards: latestArticlesContainer.getByTestId('article-card'),
    navigateButton: latestArticlesContainer.getByRole('link').first(),
    navigateToLatestArticles: async () => {
      await latestArticlesContainer.getByRole('link').first().click();
    },
  };

  const newsletter = createNewsletterElement(page);

  const newsContainer = createCategoryContainer(page, 'news');
  const guidesContainer = createCategoryContainer(page, 'guides');
  const recommendedContainer = createCategoryContainer(page, 'recommended');

  return {
    latestArticles,
    newsContainer,
    guidesContainer,
    recommendedContainer,
    newsletter,
  };
};

import type { Page } from '@playwright/test';

import { createAuthorCardElement } from '../elements/author-card.element';

export const createAuthorPage = (page: Page) => {
  const authorCard = createAuthorCardElement(page);
  const articleCards = page.getByTestId('article-card');

  return {
    authorCard,
    articleCards,
  };
};

import type { Page } from '@playwright/test';

import { createAuthorCardElement } from '../elements/author-card.element';

export const createArticlePage = (page: Page) => {
  const authorCard = createAuthorCardElement(page);

  return {
    authorCard,
  };
};

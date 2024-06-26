import type { Page } from '@playwright/test';

import { createAuthorCardElement } from '../elements/author-card.element';

export const createBecomeAuthorPage = (page: Page) => {
  const authorCard = createAuthorCardElement(page);

  const advertisementContainer = page.getByTestId(
    'become-author-advertisement',
  );
  const advertisement = {
    container: advertisementContainer,
    title: advertisementContainer.getByRole('heading').first(),
    description: advertisementContainer.getByRole('paragraph').first(),
    button: advertisementContainer.getByRole('link').first(),
  };

  return {
    authorCard,
    advertisement,
  };
};

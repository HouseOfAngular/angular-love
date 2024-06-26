import type { Page } from '@playwright/test';

import { createNewsletterElement } from '../elements/newsletter.element';

export const createAboutUsPage = (page: Page) => {
  const newsletter = createNewsletterElement(
    page.getByTestId('newsletter-form').first(),
  );

  const mobileNewsletter = createNewsletterElement(
    page.getByTestId('newsletter-form').last(),
  );

  const authorCards = page.getByTestId('author-card');
  return {
    newsletter,
    mobileNewsletter,
    authorCards,
  };
};

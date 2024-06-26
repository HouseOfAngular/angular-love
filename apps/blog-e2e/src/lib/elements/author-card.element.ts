import { Page } from '@playwright/test';

export const createAuthorCardElement = (page: Page, nth?: number) => {
  const card = page.getByTestId('author-card').nth(nth ?? 0);
  const slug = card.getAttribute('id');
  const avatar = card.getByRole('link').first();

  return {
    card,
    slug,
    avatar,
    navigateToAuthor: async () => {
      await avatar.click();
    },
  };
};

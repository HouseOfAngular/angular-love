import { Page } from '@playwright/test';

export const createCategoryContainer = (page: Page, category: string) => {
  const container = page.getByTestId(`category-${category}`);
  const title = container.getByTestId('article-list-title');
  const navigateButton = container.getByRole('link').first();
  const cards = container.getByTestId('article-card');

  return {
    container,
    title,
    navigateButton,
    cards,
    navigateToCategoryPage: async () => {
      await navigateButton.click();
    },
  };
};

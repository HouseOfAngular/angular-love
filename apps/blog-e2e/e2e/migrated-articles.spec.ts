import { expect, test } from '@playwright/test';

const slugs = [];

test.describe('migrated articles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  slugs.forEach(({ slug }) => {
    test(`should proper display ${slug}`, async ({ page }) => {
      await page.goto(`/en/${slug}`);

      const title = await page.locator('#article-title');

      await expect(title).toBeVisible();
      await expect(page).toHaveURL(`/en/${slug}`);
    });
  });
});

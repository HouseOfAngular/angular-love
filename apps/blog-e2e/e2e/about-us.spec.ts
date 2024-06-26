import { expect, test } from '@playwright/test';

import { createAuthorCardElement } from '../src/lib/elements/author-card.element';
import { createAboutUsPage } from '../src/lib/pages/about-us.page';

test.describe('about us page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about-us', { timeout: 3000 });
  });

  test('has author cards', async ({ page }) => {
    await page.mouse.down();

    const aboutUsPage = createAboutUsPage(page);
    const authorCardsCount = await aboutUsPage.authorCards.count();

    await expect(authorCardsCount).toBeGreaterThan(0);
  });

  test('navigate to author page', async ({ page }) => {
    const authorCard = createAuthorCardElement(page);

    const slug = await authorCard.slug;

    await expect(slug).not.toBeNull();

    await authorCard.navigateToAuthor();

    await expect(page).toHaveURL(`/author/` + slug);
  });

  test('visible newsletter form', async ({ page, isMobile }) => {
    const aboutUsPage = createAboutUsPage(page);

    // eslint-disable-next-line playwright/no-conditional-in-test
    const newsletter = isMobile
      ? aboutUsPage.mobileNewsletter
      : aboutUsPage.newsletter;

    await expect(newsletter.form).toBeVisible();
  });
});

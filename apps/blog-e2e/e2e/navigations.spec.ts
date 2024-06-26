import { expect, test } from '@playwright/test';

import { createArticlePage } from '../src/lib/pages/article.page';
import { createBasePage } from '../src/lib/pages/base.page';
import { createHomePage } from '../src/lib/pages/home.page';

test.describe('navigations', () => {
  test.describe('with pl localization', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('navigate to about us', async ({ page }) => {
      const basePage = createBasePage(page);

      await basePage.goToAboutUs();

      await expect(page).toHaveURL('/about-us');
    });

    test('navigate to meetups', async ({ page, context }) => {
      const basePage = createBasePage(page);

      const meetupPage = await basePage.openMeetupPage(context);

      await expect(meetupPage).toHaveURL('https://meetup.angular.love/');
    });

    test('navigate to become author', async ({ page }) => {
      const basePage = createBasePage(page);

      await basePage.goToBecomeAuthor();

      await expect(page).toHaveURL('/become-author');
    });

    test('navigate to latest articles', async ({ page }) => {
      const homePage = createHomePage(page);

      await homePage.latestArticles.navigateToLatestArticles();

      await expect(page).toHaveURL('/latest');
    });

    test('navigate to news', async ({ page }) => {
      const homePage = createHomePage(page);

      await homePage.newsContainer.navigateToCategoryPage();

      await expect(page).toHaveURL('/news');
    });

    test('navigate to guides', async ({ page }) => {
      const homePage = createHomePage(page);

      await homePage.guidesContainer.navigateToCategoryPage();

      await expect(page).toHaveURL('/guides');
    });

    test('navigate to article details', async ({ page }) => {
      const homePage = createHomePage(page);

      const article = homePage.latestArticles.cards.first();

      const slug = await article.getAttribute('id');

      await article.click();

      await expect(page).toHaveURL(`/${slug}`);
    });

    test('navigate to author page', async ({ page }) => {
      const homePage = createHomePage(page);

      const article = homePage.latestArticles.cards.first();

      await article.click();

      const articlePage = createArticlePage(page);

      const authorSlug = await articlePage.authorCard.slug;

      await articlePage.authorCard.navigateToAuthor();

      await expect(page).toHaveURL(`/author/` + authorSlug);
    });
  });

  test.describe('with en localization', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en');
    });

    test('navigate to about us', async ({ page }) => {
      const basePage = createBasePage(page);

      await basePage.goToAboutUs();

      await expect(page).toHaveURL('/en/about-us');
    });

    test('opens meetups page', async ({ page, context }) => {
      const basePage = createBasePage(page);

      const meetupPage = await basePage.openMeetupPage(context);

      await expect(meetupPage).toHaveURL('https://meetup.angular.love/');
    });

    test('navigate to become author', async ({ page }) => {
      const basePage = createBasePage(page);

      await basePage.goToBecomeAuthor();

      await expect(page).toHaveURL('/en/become-author');
    });

    test('navigate to latest articles', async ({ page }) => {
      const homePage = createHomePage(page);

      await homePage.latestArticles.navigateToLatestArticles();

      await expect(page).toHaveURL('en/latest');
    });

    test('navigate to news', async ({ page }) => {
      const homePage = createHomePage(page);

      await homePage.newsContainer.navigateToCategoryPage();

      await expect(page).toHaveURL('/en/news');
    });

    test('navigate to guides', async ({ page }) => {
      const homePage = createHomePage(page);

      await homePage.guidesContainer.navigateToCategoryPage();

      await expect(page).toHaveURL('/en/guides');
    });

    test('navigate to article details', async ({ page }) => {
      const homePage = createHomePage(page);

      const firtArticle = homePage.latestArticles.cards.first();

      const slug = await firtArticle.getAttribute('id');

      await firtArticle.click();

      await expect(page).toHaveURL(`/en/${slug}`);
    });

    test('navigate to author page', async ({ page }) => {
      const homePage = createHomePage(page);

      const article = homePage.latestArticles.cards.first();

      await article.click();

      const articlePage = createArticlePage(page);

      const authorSlug = await articlePage.authorCard.slug;

      await articlePage.authorCard.navigateToAuthor();

      await expect(page).toHaveURL(`en/author/` + authorSlug);
    });
  });
});

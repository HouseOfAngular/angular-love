import type { BrowserContext, Page } from '@playwright/test';

export const createBasePage = (page: Page) => {
  const home = page.getByTestId('header-home');

  const aboutUs = page.getByTestId('navigation-about-us');
  const meetups = page.getByTestId('navigation-meetups');
  const becomeAuthor = page.getByTestId('navigation-become-author');

  const enSwitch = page.getByTestId('header-en-switch');
  const plSwitch = page.getByTestId('header-pl-switch');

  const search = page.getByTestId('header-search');
  const searchInput = page.getByTestId('navigation-search-input');

  return {
    home,
    aboutUs,
    meetups,
    becomeAuthor,
    enSwitch,
    plSwitch,
    search,
    goToHome: async () => await home.click(),
    goToAboutUs: async () => await aboutUs.first().click(),
    openMeetupPage: async (context: BrowserContext) => {
      const pagePromise = context.waitForEvent('page');
      await meetups.first().click();
      const newPage = await pagePromise;
      return newPage;
    },
    goToBecomeAuthor: async () => await becomeAuthor.first().click(),
    switchToEn: async () => {
      await enSwitch.click();
      await page.waitForURL(/\/en/);
    },
    switchToPl: async () => plSwitch.click(),
    openSearchDialog: async () => search.click(),
    searchResults: async (query: string) => {
      await search.click();
      await searchInput.fill(query);
      await searchInput.press('Enter');
    },
  };
};

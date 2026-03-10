import { writeFile } from 'node:fs/promises';

import { generateRss, type RssOptions } from './build-rss.ts';
import { generateSitemap } from './build-sitemap.ts';
import type { Language, RouteData } from './models';

const API_BASE_URL = process.env.AL_API_URL;
const BASE_URL = process.env.AL_BASE_URL;

const SSG_ROUTES_FILE_PATH = 'apps/blog/routes.txt';
const SRC_DIR = 'apps/blog/src';
const SITEMAP_FILE_PATH = `${SRC_DIR}/sitemap.xml`;
const ASSETS_DIR = `${SRC_DIR}/assets`;
const BANNERS_FILE_PREFIX = `${ASSETS_DIR}/banners`;

const SUPPORTED_LANGUAGES: Language[] = ['pl', 'en'];
const DEFAULT_LANGUAGE: Language = 'en';

const STATIC_ROUTE_PATHS: string[] = [
  '',
  'about-us',
  'become-author',
  'search',
  'latest',
  'news',
  'guides',
  '404',
];

const rssFeeds = {
  en: {
    title: 'Angular.love Blog',
    description:
      'This is the place where you can learn Angular, discover best practices, explore advanced techniques, and stay updated with the latest news and trends.',
    lang: 'en',
    link: 'https://angular.love',
    rssFileName: `feed.xml`,
    feedUrl: 'https://angular.love/feed.xml',
    imageUrl: 'https://angular.love/assets/angular-love-logo.webp',
    alternateFeeds: [
      { feedUrl: 'https://angular.love/feed-pl.xml', lang: 'pl' },
    ],
  },
  pl: {
    title: 'Angular.love Blog (PL)',
    description:
      'Miejsce, gdzie możesz nauczyć się Angulara, odkrywać najlepsze praktyki, eksplorować zaawansowane techniki i być na bieżąco z najnowszymi Angularowymi wiadomościami oraz trendami.',
    lang: 'pl',
    link: 'https://angular.love/pl',
    rssFileName: `feed-pl.xml`,
    feedUrl: 'https://angular.love/feed-pl.xml',
    imageUrl: 'https://angular.love/assets/angular-love-logo.webp',
    alternateFeeds: [{ feedUrl: 'https://angular.love/feed.xml', lang: 'en' }],
  },
} satisfies Record<Language, RssOptions>;

const ssgRoutes: RouteData[] = [];
const articleRoutes: RouteData[] = [];

const constructUrl = (path: string, lang: Language): string =>
  `/${lang}/${path}`;

async function fetchArticleRoutes(
  lang: Language,
  skip = 0,
  take = 50,
): Promise<void> {
  const url = `${API_BASE_URL}/articles?skip=${skip}&take=${take}&showHidden`;
  try {
    const response = await fetch(url, {
      headers: {
        'x-al-lang': lang,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: HTTP ${response.status} ${response.statusText}`);
    }

    const { data, total } = (await response.json()) as {
      data: any[];
      total: number;
    };

    const articleData: RouteData[] = data.map((article) => ({
      url: constructUrl(article.slug, lang),
      publishDate: article.publishDate,
      title: article.title,
      description: article.excerpt,
      lang: lang,
    }));

    ssgRoutes.push(...articleData);
    articleRoutes.push(...articleData);

    if (total > skip + take) {
      await fetchArticleRoutes(lang, skip + take, take);
    }
  } catch (error) {
    console.error(`Failed to fetch articles from ${url}`);
    throw error;
  }
}

async function fetchAuthorRoutes(
  lang: Language,
  skip = 0,
  take = 50,
): Promise<void> {
  const url = `${API_BASE_URL}/authors?skip=${skip}&take=${take}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch authors: HTTP ${response.status} ${response.statusText}`);
    }

    const { data, total } = (await response.json()) as {
      data: any[];
      total: number;
    };

    const authorSlugs: RouteData[] = data.map((author) => ({
      url: constructUrl(`author/${author.slug}`, lang),
      publishDate: new Date().toISOString(),
    }));

    ssgRoutes.push(...authorSlugs);

    if (total > skip + take) {
      await fetchAuthorRoutes(lang, skip + take, take);
    }
  } catch (error) {
    console.error(`Failed to fetch authors from ${url}`);
    throw error;
  }
}

async function fetchBannersAndWriteToFile(): Promise<void> {
  const url = `${API_BASE_URL}/banners`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch banners: HTTP ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    await writeFile(
      `${BANNERS_FILE_PREFIX}.json`,
      JSON.stringify({ banners: data }),
      'utf-8'
    );
  } catch (error) {
    console.error('Failed to fetch banners or write to file:', error);
    throw error;
  }
}

function appendStaticRoutes(lang: Language): void {
  const staticRoutes: RouteData[] = STATIC_ROUTE_PATHS.map((path) => ({
    url: constructUrl(path, lang),
    publishDate: new Date().toISOString(),
  }));
  ssgRoutes.push(...staticRoutes);
}

async function writeSSGRoutesToFile(): Promise<void> {
  try {
    const routeLines = ssgRoutes.map((routeObj) => {
      const defaultLangPrefix = `/${DEFAULT_LANGUAGE}/`;
      return routeObj.url.startsWith(defaultLangPrefix)
        ? routeObj.url.replace(defaultLangPrefix, '/')
        : routeObj.url;
    });

    const content = routeLines.join('\n') + '\n';
    await writeFile(SSG_ROUTES_FILE_PATH, content, 'utf-8');
  } catch (error) {
    console.error('Error writing paths to file:', error);
    throw error;
  }
}

async function main(): Promise<void> {
  if (!API_BASE_URL || !BASE_URL) {
    console.error(
      'Required environment variables AL_API_URL and AL_BASE_URL must be set',
    );
    process.exit(1);
  }

  try {
    await Promise.all([
      ...SUPPORTED_LANGUAGES.map((lang) => fetchArticleRoutes(lang)),
      ...SUPPORTED_LANGUAGES.map((lang) => fetchAuthorRoutes(lang)),
      fetchBannersAndWriteToFile(),
    ]);

    SUPPORTED_LANGUAGES.forEach((lang) => {
      appendStaticRoutes(lang);
    });

    await writeSSGRoutesToFile();

    await generateSitemap({
      ssgRoutes,
      baseUrl: BASE_URL,
      staticRoutePaths: STATIC_ROUTE_PATHS,
      sitemapFilePath: SITEMAP_FILE_PATH,
    });

    for (const lang of SUPPORTED_LANGUAGES) {
      await generateRss(articleRoutes, SRC_DIR, rssFeeds[lang]);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();

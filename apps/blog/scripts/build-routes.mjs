import { createWriteStream } from 'node:fs';

import { generateSitemap } from './build-sitemap.mjs';

const API_BASE_URL = process.env.AL_API_URL;
const BASE_URL = process.env.AL_BASE_URL;
const SSG_ROUTES_FILE_PATH = 'apps/blog/routes.txt';
const SITEMAP_FILE_PATH = 'apps/blog/src/sitemap.xml';
const ROOT_PATHS_FILE_PREFIX = 'apps/blog/src/assets/root-paths';

const SUPPORTED_LANGUAGES = ['pl', 'en'];
const DEFAULT_LANGUAGE = 'en';

const STATIC_ROUTE_PATHS = [
  '',
  'about-us',
  'become-author',
  'search',
  'latest',
  'news',
  'guides',
  '404',
];

/**
 * @type {Array<{url: string, publishDate: string}>}
 */
const ssgRoutes = [];
/**
 * @type {Array<{url: string, publishDate: string}>}
 */
const articleRoutes = [];
const pageRoutes = [];

/**
 * Constructs a URL for a given path and language.
 * @param {string} path
 * @param {"pl" | "en"} lang
 * @returns {string}
 */
const constructUrl = (path, lang) => `/${lang}/${path}`;

/**
 * Fetches article paths and appends them to the routes arrays.
 * @param {"pl" | "en"} lang
 * @param {number} skip
 * @param {number} take
 * @returns {Promise<void>}
 */
async function fetchArticleRoutes(lang, skip = 0, take = 50) {
  const url = `${API_BASE_URL}/articles?skip=${skip}&take=${take}`;
  try {
    const { data, total } = await fetch(url, {
      headers: {
        'x-al-lang': lang,
      },
    }).then((resp) => resp.json());

    const articleSlugs = data.map((article) => ({
      url: constructUrl(article.slug, lang),
      publishDate: article.publishDate,
    }));

    ssgRoutes.push(...articleSlugs);
    articleRoutes.push(...articleSlugs);

    if (total > skip + take) {
      await fetchArticleRoutes(lang, skip + take, take);
    }
  } catch (error) {
    console.error(`Failed to fetch articles from ${url}`);
    throw error;
  }
}

/**
 * Fetches author paths and appends them to the routes array.
 * @param {"pl" | "en"} lang
 * @param {number} skip
 * @param {number} take
 * @returns {Promise<void>}
 */
async function fetchAuthorRoutes(lang, skip = 0, take = 50) {
  const url = `${API_BASE_URL}/authors?skip=${skip}&take=${take}`;
  try {
    const { data, total } = await fetch(url).then((resp) => resp.json());

    const authorSlugs = data.map((author) => ({
      url: constructUrl(`author/${author.slug}`, lang),
      publishDate: new Date().toISOString(), // Using current date as authors don't have a publish date
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

/**
 * Fetches pages paths and appends them to the routes array.
 * @param {"pl" | "en"} lang
 * @returns {Promise<void>}
 */
async function fetchPageRoutes(lang) {
  const url = `${API_BASE_URL}/pages`;
  try {
    const { data } = await fetch(url).then((resp) => resp.json());
    const pageSlugs = data
      .filter((page) => page.lang === lang)
      .map((page) => ({
        url: constructUrl(page.slug, lang),
        publishDate: new Date().toISOString(),
      }));
    ssgRoutes.push(...pageSlugs);
    pageRoutes.push(...pageSlugs);
  } catch (error) {
    console.error(`Failed to fetch pages from ${url}`);
    throw error;
  }
}

/**
 * Appends static paths to the routes array for a given language.
 * @param {"pl" | "en"} lang
 */
function appendStaticRoutes(lang) {
  const staticRoutes = STATIC_ROUTE_PATHS.map((path) => ({
    url: constructUrl(path, lang),
    publishDate: new Date().toISOString(), // Using current date for static paths
  }));
  ssgRoutes.push(...staticRoutes);
}

/**
 * Writes all paths stored in the routes array to a file.
 */
function writeSSGRoutesToFile() {
  const stream = createWriteStream(SSG_ROUTES_FILE_PATH, {
    encoding: 'utf-8',
  });

  stream.on('error', (error) => {
    console.error('Error writing paths to file:', error);
  });

  try {
    ssgRoutes.forEach((routeObj) => {
      const route = routeObj.url;
      const defaultLangPrefix = `/${DEFAULT_LANGUAGE}/`;
      const formattedRoute = route.startsWith(defaultLangPrefix)
        ? route.replace(defaultLangPrefix, '/')
        : route;

      if (!stream.write(`${formattedRoute}\n`)) {
        stream.once('drain', () => writeSSGRoutesToFile());
      }
    });
  } catch (error) {
    console.error('Error during write operation:', error);
    throw error;
  } finally {
    stream.end();
  }
}

/**
 * Creates a static JSON asset with allowed article & pages paths for a given language.
 * @param {"pl" | "en"} lang
 */
function writePathsToFile(lang) {
  const stream = createWriteStream(`${ROOT_PATHS_FILE_PREFIX}-${lang}.json`, {
    encoding: 'utf-8',
  });

  stream.on('error', (error) => {
    console.error('Error writing paths to file:', error);
  });

  const filteredArticlePaths = articleRoutes
    .filter((pathObj) => pathObj.url.startsWith(`/${lang}/`))
    .map((pathObj) => pathObj.url.replace(`/${lang}/`, ''));
  const filteredPagePaths = pageRoutes
    .filter((pathObj) => pathObj.url.startsWith(`/${lang}/`))
    .map((pathObj) => pathObj.url.replace(`/${lang}/`, ''));

  try {
    stream.write(
      JSON.stringify({
        articles: filteredArticlePaths,
        pages: filteredPagePaths,
      }),
    );
  } catch (error) {
    console.error('Error during write operation:', error);
    throw error;
  } finally {
    stream.end();
  }
}

async function main() {
  try {
    await Promise.all([
      ...SUPPORTED_LANGUAGES.map((lang) => fetchArticleRoutes(lang)),
      ...SUPPORTED_LANGUAGES.map((lang) => fetchAuthorRoutes(lang)),
      ...SUPPORTED_LANGUAGES.map((lang) => fetchPageRoutes(lang)),
    ]);

    SUPPORTED_LANGUAGES.forEach((lang) => {
      appendStaticRoutes(lang);
      writePathsToFile(lang);
    });

    writeSSGRoutesToFile();
    generateSitemap({
      ssgRoutes,
      baseUrl: BASE_URL,
      staticRoutePaths: STATIC_ROUTE_PATHS,
      sitemapFilePath: SITEMAP_FILE_PATH,
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();

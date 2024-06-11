import { createWriteStream } from 'node:fs';

const SSG_ROUTES_FILE_PATH = 'apps/blog/routes.txt';
const ROOT_PATHS_FILE_PREFIX = 'apps/blog/src/assets/root-paths';

const SUPPORTED_LANGUAGES = ['pl', 'en'];
const DEFAULT_LANGUAGE = 'pl';

const STATIC_ROUTE_PATHS = [
  '',
  'about-us',
  'become-author',
  'search',
  'latest',
  'news',
  'guides',
];

/**
 * @type {string[]}
 */
const ssgRoutes = [];
/**
 * @type {string[]}
 */
const articleRoutes = [];

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
  const url = `${process.env.AL_API_URL}/articles?skip=${skip}&take=${take}`;
  try {
    const { data, total } = await fetch(url, {
      headers: {
        'x-al-lang': lang,
      },
    }).then((resp) => resp.json());

    const articleSlugs = data.map((article) =>
      constructUrl(article.slug, lang),
    );

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
  const url = `${process.env.AL_API_URL}/authors?skip=${skip}&take=${take}`;
  try {
    const { data, total } = await fetch(url).then((resp) => resp.json());

    const authorSlugs = data.map((author) =>
      constructUrl(`author/${author.slug}`, lang),
    );

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
 * Appends static paths to the routes array for a given language.
 * @param {"pl" | "en"} lang
 */
function appendStaticRoutes(lang) {
  const staticRoutes = STATIC_ROUTE_PATHS.map((path) =>
    constructUrl(path, lang),
  );
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
    ssgRoutes.forEach((route) => {
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
 * Creates a static JSON asset with allowed article paths for a given language.
 * @param {"pl" | "en"} lang
 */
function writeArticlePathsToFile(lang) {
  const stream = createWriteStream(`${ROOT_PATHS_FILE_PREFIX}-${lang}.json`, {
    encoding: 'utf-8',
  });

  stream.on('error', (error) => {
    console.error('Error writing paths to file:', error);
  });

  const filteredArticlePaths = articleRoutes
    .filter((path) => path.startsWith(`/${lang}/`))
    .map((path) => path.replace(`/${lang}/`, ''));

  try {
    stream.write(JSON.stringify({ articles: filteredArticlePaths }));
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
    ]);

    SUPPORTED_LANGUAGES.forEach((lang) => {
      appendStaticRoutes(lang);
      writeArticlePathsToFile(lang);
    });

    writeSSGRoutesToFile();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();

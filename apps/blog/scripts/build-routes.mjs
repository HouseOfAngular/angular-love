import { createWriteStream } from 'node:fs';

const ROUTES_FILE = 'apps/blog/routes.txt';
const PATHS = ['/', '/about-us', '/search', '/articles', '/news', '/guides'];

/**
 * Fetches article paths from an external API and appends them to the PATHS array.
 * @param {number} skip
 * @param {number} take
 * @returns {Promise<void>}
 */
async function fetchAndAppendArticlePaths(skip = 0, take = 50) {
  const url = `${process.env.AL_API_URL}/articles?skip=${skip}&take=${take}`;
  try {
    const { data, total } = await fetch(url).then((resp) => resp.json());

    PATHS.push(...data.map((article) => `/article/${article.slug}`));

    if (total > skip + take) {
      await fetchAndAppendArticlePaths(skip + take, take);
    }
  } catch (error) {
    console.error(`Failed to fetch articles from ${url}`);
    throw error;
  }
}

/**
 * Fetches author paths from an external API and appends them to the PATHS array.
 * @param {number} skip
 * @param {number} take
 * @returns {Promise<void>}
 */
async function fetchAndAppendAuthorPaths(skip = 0, take = 50) {
  const url = `${process.env.AL_API_URL}/authors?skip=${skip}&take=${take}`;
  try {
    const { data, total } = await fetch(url).then((resp) => resp.json());

    PATHS.push(...data.map((author) => `/author/${author.slug}`));

    if (total > skip + take) {
      await fetchAndAppendAuthorPaths(skip + take, take);
    }
  } catch (error) {
    console.error(`Failed to fetch authors from ${url}`);
    throw error;
  }
}

/**
 * Writes all paths stored in the PATHS array to the ROUTES_FILE.
 * Each path is written on a new line.
 */
function writePathsToFile() {
  const stream = createWriteStream(ROUTES_FILE, {
    encoding: 'utf-8',
  });

  stream.on('error', (error) => {
    console.error('Error writing paths to file:', error);
  });

  try {
    PATHS.forEach((path) => {
      if (!stream.write(`${path}\n`)) {
        stream.once('drain', () => writePathsToFile());
      }
    });
  } catch (error) {
    console.error('Error during write operation:', error);
    throw error;
  } finally {
    stream.end();
  }
}

async function main() {
  try {
    await fetchAndAppendArticlePaths();
    await fetchAndAppendAuthorPaths();
    writePathsToFile();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();

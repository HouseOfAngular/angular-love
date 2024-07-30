import { createWriteStream } from 'node:fs';
import { create } from 'xmlbuilder2';

/**
 * Generates an XML sitemap and writes it to a file.
 * @param {{ ssgRoutes: Array<{url: string, publishDate: string}>; baseUrl: string; staticRoutePaths: Array<string>; sitemapFilePath: string }} options
 */
export function generateSitemap({
  ssgRoutes,
  baseUrl,
  staticRoutePaths,
  sitemapFilePath,
}) {
  const urlset = create({ version: '1.0' }).ele('urlset', {
    xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
  });

  ssgRoutes.forEach((routeObj) => {
    const url = urlset.ele('url');
    const modifiedUrl = routeObj.url.replace('/en/', '/');

    url.ele('loc').txt(`${baseUrl}${modifiedUrl}`);
    url.ele('lastmod').txt(new Date(routeObj.publishDate).toISOString());

    if (routeObj.url === '/pl/' || routeObj.url === '/en/') {
      url.ele('priority').txt('1.0');
      url.ele('changefreq').txt('weekly');
    } else if (
      staticRoutePaths.some(
        (staticRoute) =>
          staticRoute !== '' && routeObj.url.includes(staticRoute),
      )
    ) {
      url.ele('priority').txt('0.9');
      url.ele('changefreq').txt('weekly');
    } else {
      url.ele('priority').txt(determinePriority(routeObj.publishDate));
      url.ele('changefreq').txt('monthly');
    }
  });

  const xml = urlset.end({ prettyPrint: true });
  const stream = createWriteStream(sitemapFilePath, {
    encoding: 'utf-8',
  });

  stream.on('error', (error) => {
    console.error('Error writing sitemap to file:', error);
  });

  try {
    stream.write(xml);
  } catch (error) {
    console.error('Error during write operation:', error);
    throw error;
  } finally {
    stream.end();
  }
}

/**
 * Determines the priority for a URL based on its publish date.
 * @param {string} publishDate
 * @returns {string}
 */
function determinePriority(publishDate) {
  const publishDateTime = new Date(publishDate).getTime();
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  return publishDateTime < twoYearsAgo.getTime() ? '0.3' : '0.8';
}

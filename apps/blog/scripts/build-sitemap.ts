import { writeFile } from 'node:fs/promises';
import { create } from 'xmlbuilder2';

export interface SitemapOptions {
  ssgRoutes: { url: string; publishDate: string }[];
  baseUrl: string;
  staticRoutePaths: string[];
  sitemapFilePath: string;
}

export async function generateSitemap({
  ssgRoutes,
  baseUrl,
  staticRoutePaths,
  sitemapFilePath,
}: SitemapOptions): Promise<void> {
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

  try {
    await writeFile(sitemapFilePath, xml, 'utf-8');
  } catch (error) {
    console.error('Error writing sitemap to file:', error);
    throw error;
  }
}

function determinePriority(publishDate: string): string {
  const publishDateTime = new Date(publishDate).getTime();
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  return publishDateTime < twoYearsAgo.getTime() ? '0.3' : '0.8';
}

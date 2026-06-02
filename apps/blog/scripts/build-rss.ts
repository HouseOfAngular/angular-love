import { writeFile } from 'node:fs/promises';
import { create } from 'xmlbuilder2';

import type { Language, RouteData } from './models.ts';

export interface RssOptions {
  link: string;
  title: string;
  description: string;
  rssFileName: string;
  lang: Language;
  feedUrl: string;
  imageUrl: string;
  alternateFeeds: {
    lang: Language;
    feedUrl: string;
  }[];
}

const currentDate = new Date().toUTCString();

export async function generateRss(
  articleRoutes: RouteData[],
  outputLocation: string,
  {
    link,
    title,
    description,
    rssFileName,
    lang,
    feedUrl,
    imageUrl,
    alternateFeeds,
  }: RssOptions,
): Promise<void> {
  const feedArticles = articleRoutes
    .filter((route) => route.lang === lang)
    .sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
    )
    .slice(0, 20)
    .map((e) => ({ ...e, description: e.description?.replace('\n', '') }));

  const root = create({ version: '1.0', encoding: 'UTF-8' }).ele('rss', {
    version: '2.0',
    'xmlns:atom': 'http://www.w3.org/2005/Atom',
  });
  const channel = root.ele('channel');

  channel
    .ele('title')
    .txt(title)
    .up()
    .ele('link')
    .txt(link)
    .up()
    .ele('atom:link', {
      href: feedUrl,
      rel: 'self',
      type: 'application/rss+xml',
    })
    .up()
    .ele('description')
    .txt(description)
    .up()
    .ele('language')
    .txt(lang)
    .up()
    .ele('lastBuildDate')
    .txt(currentDate)
    .up();

  for (const alternateFeed of alternateFeeds) {
    channel
      .ele('atom:link', {
        rel: 'alternate',
        href: alternateFeed.feedUrl,
        hreflang: alternateFeed.lang,
      })
      .up();
  }

  if (imageUrl) {
    channel
      .ele('image')
      .ele('url')
      .txt(imageUrl)
      .up()
      .ele('title')
      .txt(title)
      .up()
      .ele('link')
      .txt(link)
      .up()
      .up();
  }

  for (const article of feedArticles) {
    if (!article.title) {
      continue;
    }
    const item = channel.ele('item');
    const modifiedUrl = article.url.replace('/en/', '/');
    const articleLink = `${link}${modifiedUrl}`;

    item.ele('title').txt(article.title).up();
    item.ele('link').txt(articleLink).up();

    item.ele('guid').txt(articleLink).up();

    item.ele('pubDate').txt(new Date(article.publishDate).toUTCString()).up();

    if (article.description) {
      item.ele('description').dat(article.description).up();
    }
  }

  const xml = root.end({ prettyPrint: true });

  try {
    await writeFile(`${outputLocation}/${rssFileName}`, xml, 'utf-8');
  } catch (error) {
    console.error(`Error during RSS (${lang}) write operation:`, error);
    throw error;
  }
}

import { create } from 'xmlbuilder2';

const BASE_URL = 'https://angular.love';
const CHANNEL_IMAGE_URL = `${BASE_URL}/assets/angular-love-logo.webp`;

export type FeedArticle = {
  slug: string;
  title: string;
  excerpt: string;
  publishDate: Date;
  imageUrl: string | null;
  authorName: string | null;
};

export type FeedConfig = {
  title: string;
  channelLink: string;
  feedUrl: string;
  alternateFeedUrl: string;
  alternateFeedLang: string;
  description: string;
  language: string;
  articleUrlPrefix: string;
};

export function buildRssFeed(
  feedArticles: FeedArticle[],
  config: FeedConfig,
): string {
  const lastBuildDate = new Date().toUTCString();

  const root = create({ version: '1.0', encoding: 'UTF-8' }).ele('rss', {
    version: '2.0',
    'xmlns:atom': 'http://www.w3.org/2005/Atom',
    'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
  });

  const channel = root.ele('channel');

  channel
    .ele('title')
    .txt(config.title)
    .up()
    .ele('link')
    .txt(config.channelLink)
    .up()
    .ele('atom:link', {
      href: config.feedUrl,
      rel: 'self',
      type: 'application/rss+xml',
    })
    .up()
    .ele('atom:link', {
      href: config.alternateFeedUrl,
      rel: 'alternate',
      hreflang: config.alternateFeedLang,
    })
    .up()
    .ele('description')
    .txt(config.description)
    .up()
    .ele('language')
    .txt(config.language)
    .up()
    .ele('lastBuildDate')
    .txt(lastBuildDate)
    .up()
    .ele('ttl')
    .txt('60')
    .up()
    .ele('copyright')
    .txt(`© ${new Date().getFullYear()} angular.love`)
    .up()
    .ele('image')
    .ele('url')
    .txt(CHANNEL_IMAGE_URL)
    .up()
    .ele('title')
    .txt('angular.love')
    .up()
    .ele('link')
    .txt(config.channelLink)
    .up()
    .up();

  for (const article of feedArticles) {
    const articleLink = `${config.articleUrlPrefix}/${article.slug}`;
    const item = channel.ele('item');

    item
      .ele('title')
      .txt(article.title)
      .up()
      .ele('link')
      .txt(articleLink)
      .up()
      .ele('guid', { isPermaLink: 'true' })
      .txt(articleLink)
      .up()
      .ele('pubDate')
      .txt(article.publishDate.toUTCString())
      .up();

    if (article.excerpt) {
      item.ele('description').dat(article.excerpt).up();
    }

    if (article.authorName) {
      item.ele('dc:creator').txt(article.authorName).up();
    }

    if (article.imageUrl) {
      item
        .ele('enclosure', {
          url: article.imageUrl,
          length: '0',
          type: 'image/jpeg',
        })
        .up();
    }
  }

  return root.end({ prettyPrint: true });
}

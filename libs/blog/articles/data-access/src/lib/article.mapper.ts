import { GetPostsQuery } from '@angular-love/wp/graphql/data-access';
import * as cheerio from 'cheerio';
import { Article } from './article';

export const articlesMapper = (getPostsQuery: GetPostsQuery): Article[] => {
  return (getPostsQuery.posts?.nodes || []).map((node) => {
    const summary = cheerio.load(node.excerpt || '');

    return {
      slug: node.slug || '',
      title: node.title || '',
      authorImageUrl: node.author?.node?.avatar?.url || '',
      excerpt: summary.text(),
      authorName: node.author?.node?.name || '',
      featuredImageUrl: node.featuredImage?.node.sourceUrl || '',
      publishDate: new Date(node.date || '').toISOString(),
    };
  });
};

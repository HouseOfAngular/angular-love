import * as cheerio from 'cheerio';
import { GetPostsQuery } from '@angular-love/wp/graphql/data-access';
import { Article } from '@angular-love/blog/articles/data-access';

export const toArticlePreviewList = (query: {
  data: GetPostsQuery;
}): Article[] => {
  return (query.data.posts?.nodes || []).map((node) => {
    const summary = cheerio.load(node.excerpt || '');

    return {
      slug: node.slug || '',
      title: node.title || '',
      excerpt: summary.text(),
      featuredImageUrl: node.featuredImage?.node.sourceUrl || '',
      publishDate: new Date(node.date || '').toISOString(),
      author: {
        name: node.author?.node?.name || '',
        avatarUrl: node.author?.node?.avatar?.url || '',
      },
    };
  });
};

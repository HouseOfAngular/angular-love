import * as cheerio from 'cheerio';
import hljs from 'highlight.js';
import sanitizeHtml from 'sanitize-html';
import {
  GetPostBySlugQuery,
  GetPostsQuery,
} from '@angular-love/wp/graphql/data-access';
import {
  Article,
  ArticlePreview,
} from '@angular-love/blog/articles/data-access';

const DEFAULT_LANGUAGE_SUBSET = ['typescript', 'html', 'css', 'scss', 'json'];

export const toArticlePreviewList = (query: {
  data: GetPostsQuery;
}): ArticlePreview[] => {
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

export const toArticle = (query: { data: GetPostBySlugQuery }): Article => {
  const content = sanitizeHtml(query.data.postBy?.content || '', {
    allowedClasses: {
      pre: ['lang:*'],
    },
  });
  const $ = cheerio.load(content);

  $('[class^="lang:"]').each((index, element) => {
    const code = $(element).text();

    // Check if the content is already wrapped in a <code> block
    // WordPress tends to render this randomly
    const hasCodeBlock = $(element).children('code').length > 0;

    // If not, wrap the content in a <code> block
    // Also add `hljs` class to make it apply hljs styling schema
    if (!hasCodeBlock) {
      $(element).html(`<code class="hljs">${code}</code>`);
    } else {
      $(element).children('code').addClass('hljs');
    }

    // Detect the language and apply syntax highlighting
    const highlightedCode = hljs.highlightAuto(
      code,
      DEFAULT_LANGUAGE_SUBSET
    ).value;

    // Replace the content of the <code> block with the highlighted code
    $(element).children('code').html(highlightedCode);
  });

  const highlightedContent = $.html();

  return {
    content: highlightedContent,
    title: query.data.postBy?.title || '',
    publishDate: query.data.postBy?.date || '',
    author: {
      name: query.data.postBy?.author?.node.name || '',
      description: query.data.postBy?.author?.node.description || '',
      avatarUrl: query.data.postBy?.author?.node?.avatar?.url || '',
    },
  };
};

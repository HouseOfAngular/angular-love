import { Article, ArticlePreview } from '@angular-love/contracts/articles';
import * as cheerio from 'cheerio';
import sanitizeHtml from 'sanitize-html';
import hljs from 'highlight.js';
import { WPPostDetailsDto, WPPostDto } from './dtos';

const DEFAULT_LANGUAGE_SUBSET = ['typescript', 'html', 'css', 'scss', 'json'];

export const toArticlePreviewList = (data: WPPostDto[]): ArticlePreview[] => {
  return (data || []).map((node) => {
    const summary = cheerio.load(node.excerpt.render || '');

    return {
      slug: node.slug || '',
      title: node.title.rendered || '',
      excerpt: summary.text(),
      featuredImageUrl: node.featured_image_url || '',
      publishDate: new Date(node.date || '').toISOString(),
      author: {
        name: node.author_details.name || '',
        avatarUrl: node.author_details.avatar_url || '',
      },
    };
  });
};

export const toArticle = (dto?: WPPostDetailsDto): Article => {
  const content = sanitizeHtml(dto?.content.rendered || '', {
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
      DEFAULT_LANGUAGE_SUBSET,
    ).value;

    // Replace the content of the <code> block with the highlighted code
    $(element).children('code').html(highlightedCode);
  });

  const highlightedContent = $.html();

  return {
    title: dto?.title.rendered || '',
    publishDate: dto?.date || '',
    author: {
      name: dto?.author_details.name || '',
      description: dto?.author_details.description || '',
      avatarUrl: dto?.author_details?.avatar_url || '',
    },
    content: highlightedContent,
  };
};

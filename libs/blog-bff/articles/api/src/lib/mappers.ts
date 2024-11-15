import * as cheerio from 'cheerio';
import sanitizeHtml from 'sanitize-html';

import {
  Anchor,
  AnchorType,
  anchorTypes,
  Article,
  ArticlePreview,
} from '@angular-love/contracts/articles';

import { WPPostDetailsDto, WPPostDto } from './dtos';
import {
  modifyImages,
  modifyLinks,
  removeEmptyParagraphs,
  rewriteHTML,
  wpCodeRewriter,
} from './utils';

export const toArticlePreviewList = (dtos: WPPostDto[]): ArticlePreview[] => {
  return (dtos || []).map((dto) => {
    const summary = cheerio.load(dto.excerpt.rendered || '');
    const title = cheerio.load(dto.title.rendered || '');

    return {
      slug: dto.slug || '',
      title: title.text(),
      excerpt: summary.text(),
      featuredImageUrl: dto.featured_image_url || null,
      publishDate: new Date(dto.date || '').toISOString(),
      readingTime: dto.acf?.reading_time?.toString() || '5',
      difficulty: dto.acf?.difficulty || 'intermediate',
      author: {
        slug: dto.author_details?.slug || '',
        name: dto.author_details?.name || '',
        avatarUrl: dto.author_details?.avatar_url || '',
      },
    };
  });
};

export const toArticle = (dto?: WPPostDetailsDto): Article => {
  const title = cheerio.load(dto.title.rendered || '');

  const content = sanitizeHtml(dto?.content.rendered || '', {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img',
      'iframe',
      'script',
    ]),
    allowVulnerableTags: true,
    allowedScriptHostnames: ['platform.twitter.com'],
    allowedAttributes: {
      img: [
        'src',
        'srcset',
        'alt',
        'title',
        'width',
        'height',
        'loading',
        'decoding',
        'sizes',
      ],
      a: ['href'],
      iframe: ['src'],
      script: ['src', 'async', 'charset'],
    },
    allowedClasses: {
      blockquote: ['twitter-tweet'],
      pre: ['lang:*'],
      code: ['language-*'],
      div: ['crayon-line', 'crayon-syntax'],
    },
    transformTags: {
      b: 'strong',
    },
  });
  const $ = cheerio.load(content);

  rewriteHTML(
    wpCodeRewriter,
    removeEmptyParagraphs,
    modifyLinks,
    modifyImages,
  )($);

  // add id to anchorTypes elements for anchor links
  const anchors: Anchor[] = Array.from($(anchorTypes.join(', '))).reduce(
    (anchors, element) => {
      const title = $(element).text();

      if (!title) return anchors;

      $(element).attr('id', title);

      return [
        ...anchors,
        {
          title,
          type: $(element).prop('tagName').toLowerCase() as AnchorType,
        },
      ];
    },
    [] as Anchor[],
  );

  const highlightedContent = $('body').html().trim();

  return {
    id: dto.id || 0,
    title: title.text(),
    slug: dto?.slug || '',
    publishDate: dto?.date || '',
    readingTime: dto.acf?.reading_time?.toString() || '5',
    difficulty: dto.acf?.difficulty || 'intermediate',
    author: {
      slug: dto?.author_details?.slug || '',
      name: dto?.author_details?.name || '',
      description: dto?.author_details?.description || '',
      avatarUrl: dto?.author_details?.avatar_url || '',
      position: dto?.author_details?.position || '',
      github: dto?.author_details?.github || null,
      twitter: dto?.author_details?.twitter || null,
      linkedin: dto?.author_details?.linkedin || null,
      titles: dto?.author_details?.titles || [],
    },
    content: highlightedContent,
    anchors: anchors,
    otherTranslations: dto?.other_translations || [],
    lang: dto?.lang,
    seo: dto.yoast_head_json,
  };
};

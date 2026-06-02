import * as cheerio from 'cheerio';
import sanitizeHtml from 'sanitize-html';

import { NewArticle } from '@angular-love/blog-bff/shared/schema';
import {
  Anchor,
  AnchorType,
  anchorTypes,
  dbLocaleMap,
  SeoData,
  statusMap,
} from '@angular-love/contracts/articles';
import { WPPostDetailsDto } from '@angular-love/util-wp';

import {
  modifyImages,
  modifyLinks,
  removeEmptyParagraphs,
  rewriteHTML,
  wpCodeRewriter,
} from '../utils';

export const idToSlugMap = {
  1: 'bez-kategorii',
  4: 'tips-tricks',
  6: 'dekoratory',
  7: 'testowanie',
  8: 'performance',
  10: 'ngrx',
  16: 'nestjs',
  17: 'angular',
  61: 'bez-kategorii-en',
  63: 'angular-en',
  65: 'nestjs-en',
  110: 'architektura',
  116: 'pl-newsletter',
  118: 'en-newsletter',
  186: 'guides-en',
  188: 'guides-pl',
  190: 'news-en',
  192: 'news-pl',
  204: 'recommended-en',
  206: 'recommended-pl',
  214: 'angular-in-depth-pl',
  216: 'angular-in-depth-en',
} as Record<number, string>;

export const sanitizeContent = (htmlContent: string): string => {
  return sanitizeHtml(htmlContent, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img',
      'iframe',
      'script',
      'label',
      'video',
      'input',
      'legend',
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
      label: ['for'],
      input: ['id', 'name', 'type', 'value'],
      video: ['src', 'controls', 'width', 'height'],
    },
    allowedClasses: {
      blockquote: ['twitter-tweet'],
      pre: ['lang:*', 'language*'],
      code: ['language-*'],
      div: ['crayon-line', 'crayon-syntax'],
    },
    transformTags: {
      b: 'strong',
    },
  });
};

export const toContent = (sanitizedHtml: string) => {
  const $ = cheerio.load(sanitizedHtml);

  return {
    getHighlightedContent: () => {
      rewriteHTML(
        wpCodeRewriter,
        removeEmptyParagraphs,
        modifyLinks,
        modifyImages,
      )($);
      return $('body').html()?.trim();
    },
    getAnchors: () => {
      return Array.from($(anchorTypes.join(', '))).reduce(
        (anchors, element) => {
          const title = $(element).text();

          if (!title) return anchors;

          $(element).attr('id', title);

          return [
            ...anchors,
            {
              title,
              type: $(element).prop('tagName')?.toLowerCase() as AnchorType,
            },
          ];
        },
        [] as Anchor[],
      );
    },
  };
};

export const toSeo = (seoData: SeoData): SeoData => {
  const fields = [
    'title',
    'description',
    'robots',
    'canonical',
    'og_locale',
    'og_type',
    'og_title',
    'og_description',
    'og_url',
    'og_site_name',
    'article_publisher',
    'article_modified_time',
    'og_image',
    'twitter_card',
    'twitter_misc',
  ] as (keyof SeoData)[];

  return fields.reduce((pv, cv) => ({ ...pv, [cv]: seoData?.[cv] ?? '' }), {});
};

export const toArticle = (dto: WPPostDetailsDto): NewArticle => {
  const title = cheerio.load(dto.title.rendered || '');
  const excerpt = cheerio.load(dto.excerpt.rendered || '');
  const sanitizedContent = sanitizeContent(dto?.content.rendered || '');
  const htmlContent = toContent(sanitizedContent);
  const anchors = htmlContent.getAnchors();
  const highlightedContent = htmlContent.getHighlightedContent();
  const slugs = dto.categories.map((id: number) => idToSlugMap[id]);

  if (!dbLocaleMap[dto.lang]) {
    throw new Error('No locale!!!');
  }

  return {
    id: dto.id,
    excerpt: excerpt.text(),
    slug: dto.slug,
    status: statusMap[dto.status],
    title: title.text(),
    content: highlightedContent || '',
    publishDate: new Date(dto.date),
    modifyDate: new Date(dto.modified),
    isHidden: dto.acf.hidden ?? false,
    readingTime: parseInt(dto.acf?.reading_time?.toString() || '5', 10),
    otherTranslations: dto?.other_translations || [],
    imageUrl: dto.featured_image_url,
    anchors: anchors,
    difficulty: dto.acf?.difficulty || 'intermediate',
    language: dbLocaleMap[dto.lang],
    authorId: dto.author,
    seo: toSeo(dto.yoast_head_json),
    categories: slugs,
  };
};

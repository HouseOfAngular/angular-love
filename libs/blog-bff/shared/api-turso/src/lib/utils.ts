import type { CheerioAPI } from 'cheerio';

import { highlighter } from './highlighter';

const shikiThemes = highlighter.getLoadedThemes();
const shikiLanguages = new Set(highlighter.getLoadedLanguages());

const themes = {
  dark: shikiThemes[0],
  light: shikiThemes[1],
};

const languageClassRegex = /^language-[\w-]+$/;
const dateSlugPattern =
  /^(\/[a-z]{2})?\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\/?$/;

const LANGUAGE_MAP: Record<string, string> = {
  typescript: 'angular-ts',
  ts: 'angular-ts',
  html: 'angular-html',
};

export type RewriteAdapter = ($: CheerioAPI) => void;

export const rewriteHTML = (...adapters: RewriteAdapter[]) => {
  return (content: CheerioAPI) => {
    adapters.forEach((adapter) => {
      adapter(content);
    });
  };
};

/**
 * Rewrites default Wordpress code blocks and applies HLJS styling
 * @param $
 */
export const wpCodeRewriter: RewriteAdapter = ($) => {
  $('pre').each((_, element) => {
    const code = $(element).text();
    const $pre = $(element);

    // Check if the content is already wrapped in a <code> block
    // WordPress tends to render this randomly
    const hasCodeBlock = $pre.children('code').length > 0;

    // If not, wrap the content in a <code> block
    // Also add `hljs` class to make it apply hljs styling schema
    if (!hasCodeBlock) {
      $pre.html(`<code class="hljs">${code}</code>`);
    }

    const codeClassAttr = $pre.find('code').attr()?.['class'];
    const preClassAttr = $pre.attr()?.['class'];
    const classes = codeClassAttr?.split(' ') ?? [];
    const preClasses = preClassAttr?.split(' ') ?? [];
    const codeLanguageClass = classes
      .concat(preClasses)
      .find((cl) => languageClassRegex.test(cl));

    let language = 'angular-ts';

    if (codeLanguageClass) {
      language = codeLanguageClass.replace('language-', '');
    }

    if (!shikiLanguages.has(language)) {
      language = 'angular-ts';
    }

    language = LANGUAGE_MAP[language] || language;

    let highlightedCode;
    try {
      highlightedCode = highlighter.codeToHtml(code, {
        themes,
        lang: language,
      });
    } catch (e) {
      console.log(e);
      console.log(code);
    }

    // Replace the content of the <code> block with the highlighted code
    $pre.replaceWith(highlightedCode || '');
  });
};

/**
 * Removes empty paragraphs, like `<p>&nbsp;</p>`
 * @param $
 */
export const removeEmptyParagraphs: RewriteAdapter = ($) => {
  const emptyParagraphs = $('p').filter(
    (_, el) => $(el).html()?.trim() === '&nbsp;',
  );
  emptyParagraphs.remove();
};

/**
 * Transforms legacy links to new ones
 * @param url
 */
function transformUrl(url: string): URL {
  const parsedUrl = new URL(url);

  const hostnamesToModify = ['wp.angular.love', 'replica.angular.love'];

  const matchedHostname = hostnamesToModify.find(
    (hostname) => hostname === parsedUrl.hostname,
  );

  if (matchedHostname) {
    parsedUrl.hostname = 'angular.love';

    // Regex pattern to match optional language code and /{year}/{month}/{day}/{slug}/ structure
    const match = parsedUrl.pathname.match(dateSlugPattern);

    if (match) {
      // If the pattern matches, extract the language code (if present) and the slug
      const [, langCode, , , , slug] = match;

      if (langCode) {
        parsedUrl.pathname = `${langCode}/${slug}`;
      } else {
        parsedUrl.pathname = `/${slug}`;
      }
    }
  }

  return parsedUrl;
}

/**
 * Appends aria-label and target attributes to links
 * @param $
 */
export const modifyLinks: RewriteAdapter = ($) => {
  $('a[href]').each((_, element) => {
    const $element = $(element);
    const href = $element.attr('href')!;

    if (!href.startsWith('#')) {
      try {
        const transformedURL = transformUrl(href);
        $element
          .attr('target', '_blank')
          .attr('href', transformedURL.toString())
          .attr('aria-label', `Read more on ${transformedURL.hostname}`);
      } catch (e) {
        console.error('Invalid URL:', href);
      }
    }
  });
};

/**
 * Replaces image source to the new domain
 * @param $
 */
export const modifyImages: RewriteAdapter = ($) => {
  $('img[src^="https://angular.love/wp-content"]').attr('src', (_, src) =>
    src.replace(
      'https://angular.love/wp-content',
      'https://wp.angular.love/wp-content',
    ),
  );
};

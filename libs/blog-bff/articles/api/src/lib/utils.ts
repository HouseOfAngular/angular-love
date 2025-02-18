import type { CheerioAPI } from 'cheerio';
import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

const jsEngine = createJavaScriptRegexEngine();

const highlighter = await createHighlighterCore({
  themes: [
    import('shiki/themes/github-dark.mjs'), // dark mode
    import('shiki/themes/github-light.mjs'), // light mode
  ],
  langs: [
    import('shiki/langs/shell.mjs'),
    import('shiki/langs/bash.mjs'),
    import('shiki/langs/json.mjs'),
    import('shiki/langs/typescript.mjs'),
    import('shiki/langs/angular-ts.mjs'),
    import('shiki/langs/angular-html.mjs'),
    import('shiki/langs/scss.mjs'),
    import('shiki/langs/css.mjs'),
  ],
  engine: jsEngine,
});

const shikiThemes = highlighter.getLoadedThemes();
const shikiLanguages = highlighter.getLoadedLanguages();

type RewriteAdapter = ($: CheerioAPI) => void;

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

    // Check if the content is already wrapped in a <code> block
    // WordPress tends to render this randomly
    const hasCodeBlock = $(element).children('code').length > 0;

    // If not, wrap the content in a <code> block
    // Also add `hljs` class to make it apply hljs styling schema
    if (!hasCodeBlock) {
      $(element).html(`<code class="hljs">${code}</code>`);
    }

    const classAttr = $(element).find('code').attr()['class'];
    const classes = classAttr?.split(' ') ?? [];
    const codeLanguageClass = classes.find((cl) =>
      /^language-[\w-]+$/.test(cl),
    );

    let language: string;

    if (codeLanguageClass) {
      language = codeLanguageClass.replace('language-', '');
    } else {
      language = 'angular-ts';
    }

    if (!shikiLanguages.includes(language)) {
      language = 'angular-ts';
    }

    if (language === 'typescript' || language === 'ts') {
      language = 'angular-ts';
    }

    if (language === 'html') {
      language = 'angular-html';
    }

    const highlightedCode = highlighter.codeToHtml(code, {
      themes: {
        dark: shikiThemes[0],
        light: shikiThemes[1],
      },
      lang: language,
    });

    // Replace the content of the <code> block with the highlighted code
    $(element).replaceWith(highlightedCode);
  });
};

/**
 * Removes empty paragraphs, like `<p>&nbsp;</p>`
 * @param $
 */
export const removeEmptyParagraphs: RewriteAdapter = ($) => {
  $('p').each((index, element) => {
    const $element = $(element);
    const html = $element.html().trim();

    if (html === '&nbsp;') {
      $element.remove();
    }
  });
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
    const dateSlugPattern =
      /^(\/[a-z]{2})?\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\/?$/;

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
  $('a').each((_, element) => {
    const $element = $(element);
    $element.attr('target', '_blank');

    if ($element.attr('href') && !$element.attr('href').startsWith('#')) {
      const originalHref = $element.attr('href');
      const transformedURL = transformUrl(originalHref);
      $element.attr('href', transformedURL.toString());

      $element.attr('aria-label', `Read more on ${transformedURL.hostname}`);
    }
  });
};

/**
 * Replaces image source to the new domain
 * @param $
 */
export const modifyImages: RewriteAdapter = ($) => {
  $('img').each((_, element) => {
    const $element = $(element);
    const src = $element.attr('src');

    if (src && src.startsWith('https://angular.love/wp-content')) {
      $element.attr(
        'src',
        src.replace(
          'https://angular.love/wp-content',
          'https://wp.angular.love/wp-content',
        ),
      );
    }
  });
};

import type { CheerioAPI } from 'cheerio';
import hljs from 'highlight.js';

const DEFAULT_LANGUAGE_SUBSET = ['typescript', 'html', 'css', 'scss', 'json'];

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
  $('pre').each((index, element) => {
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
};

/**
 * Rewrites code blocks generated by `crayon` plugin and applies HLJS styling
 * @param $
 */
export const crayonCodeRewriter: RewriteAdapter = ($) => {
  $('.crayon-syntax').each((index, element) => {
    const $element = $(element);
    let code = '';

    // Extract code from Crayon lines
    $element.find('.crayon-line').each((i, line) => {
      code += $(line).text() + '\n';
    });

    // Detect the language and apply syntax highlighting
    const highlightedCode = hljs.highlightAuto(
      code,
      DEFAULT_LANGUAGE_SUBSET,
    ).value;

    // Create a new <pre><code> element with the highlighted code
    const preCodeBlock = `<pre><code class="hljs">${highlightedCode}</code></pre>`;

    // Replace the entire crayon-syntax element with the new preCodeBlock
    $element.replaceWith(preCodeBlock);
  });
};

/**
 * Removes empty paragraphs, like `<p>&nbsp;</p>`
 * @param $
 */
export const removeEmptyParagraphs: RewriteAdapter = ($) => {
  $('p').each((index, element) => {
    const $element = $(element);
    const text = $element.text().trim();

    if (!text || text === '&nbsp;') {
      $element.remove();
    }
  });
};

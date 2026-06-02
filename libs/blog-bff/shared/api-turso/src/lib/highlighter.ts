import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';

let instance: HighlighterCore | undefined;
let pending: Promise<HighlighterCore> | undefined;

/**
 * Loads the shiki highlighter. Must be awaited once before mapping articles,
 * since the HTML rewriters run synchronously.
 */
export function initHighlighter(): Promise<HighlighterCore> {
  pending ??= createHighlighterCore({
    themes: [
      import('shiki/themes/github-dark.mjs'), // dark mode
      import('shiki/themes/github-light.mjs'), // light mode
    ],
    langs: [
      import('shiki/langs/json.mjs'),
      import('shiki/langs/typescript.mjs'),
      import('shiki/langs/angular-ts.mjs'),
      import('shiki/langs/angular-html.mjs'),
      import('shiki/langs/scss.mjs'),
      import('shiki/langs/css.mjs'),
      import('shiki/langs/graphql.mjs'),
      import('shiki/langs/shell.mjs'),
      import('shiki/langs/yaml.mjs'),
      import('shiki/langs/markdown.mjs'),
    ],
    engine: createOnigurumaEngine(() => import('shiki/wasm')),
  }).then((highlighter) => (instance = highlighter));

  return pending;
}

export function getHighlighter(): HighlighterCore {
  if (!instance) {
    throw new Error('Highlighter not initialized, await initHighlighter()');
  }
  return instance;
}

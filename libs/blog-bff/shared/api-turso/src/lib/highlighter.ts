import { createHighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';

export const highlighter = await createHighlighterCore({
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
});

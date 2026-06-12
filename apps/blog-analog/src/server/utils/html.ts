function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

const SANITIZATION_RULES: Array<[RegExp, string]> = [
  [new RegExp('<script[^>]*>[\\s\\S]*?<\\/script>', 'gi'), ''],
  [new RegExp('<style[^>]*>[\\s\\S]*?<\\/style>', 'gi'), ''],
  [new RegExp('<svg[^>]*>[\\s\\S]*?<\\/svg>', 'gi'), ''],
  [new RegExp('<noscript[^>]*>[\\s\\S]*?<\\/noscript>', 'gi'), ''],
  [new RegExp('', 'g'), ''],
  [new RegExp('<pre[^>]*>[\\s\\S]*?<\\/pre>', 'gi'), ' [code example] '],
  [new RegExp('<code[^>]*>[\\s\\S]*?<\\/code>', 'gi'), ' [code] '],
  [new RegExp('<[^>]*>', 'g'), ' '],
];

export function htmlToPlain(html: string): string {
  if (!html) {
    return '';
  }

  const strippedHtml = SANITIZATION_RULES.reduce(
    (text, [regex, replacement]) => text.replace(regex, replacement),
    html,
  );

  return decodeEntities(strippedHtml)
    .replace(new RegExp('[ \\t]+', 'g'), ' ')
    .replace(new RegExp(' *\\n *', 'g'), '\n')
    .replace(new RegExp('\\n{3,}', 'g'), '\n\n')
    .trim();
}

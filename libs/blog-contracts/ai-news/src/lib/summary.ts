export type AiNewsSummaryBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] };

const LIST_ITEM = /^[-*•]\s+/;

/**
 * Splits a summary into blocks. The format is plain text: blank lines
 * separate paragraphs, lines starting with `- ` (or `* `, `•`) form a list,
 * and other line breaks are spaces. Nothing else is markup, so the text is
 * always rendered as text.
 */
export function parseAiNewsSummary(text: string): AiNewsSummaryBlock[] {
  const blocks: AiNewsSummaryBlock[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flush = () => {
    if (paragraph.length) {
      blocks.push({ kind: 'paragraph', text: paragraph.join(' ') });
      paragraph = [];
    }
    if (list.length) {
      blocks.push({ kind: 'list', items: list });
      list = [];
    }
  };

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      flush();
    } else if (LIST_ITEM.test(line)) {
      if (paragraph.length) {
        flush();
      }
      list.push(line.replace(LIST_ITEM, ''));
    } else if (list.length) {
      flush();
      paragraph.push(line);
    } else {
      paragraph.push(line);
    }
  }
  flush();

  return blocks;
}

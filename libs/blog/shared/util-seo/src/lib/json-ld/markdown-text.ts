/**
 * Flatten markdown (FAQ answers) into plain text for JSON-LD. Deliberately tiny
 * instead of `marked`: this lib ships in a shared chunk, and schema.org text
 * fields only need the words, not the formatting.
 *
 * Code is set aside before any other rule runs, so `a*b*` or `__init__` inside
 * backticks survive untouched.
 */
const PLACEHOLDER = /\uE000(\d+)\uE000/g;

export function markdownToPlainText(
  markdown: string | null | undefined,
): string {
  if (!markdown) {
    return '';
  }

  const code: string[] = [];
  const stash = (text: string) => `\uE000${code.push(text) - 1}\uE000`;

  return (
    markdown
      .replace(/^```[^\n]*\n([\s\S]*?)^```/gm, (_, body: string) => stash(body))
      // Block markers: headings, blockquotes, list bullets and numbers.
      .replace(/^[ \t]*#{1,6}[ \t]+/gm, '')
      .replace(/^[ \t]*>[ \t]?/gm, '')
      .replace(/^[ \t]*(?:[-*+]|\d+[.)])[ \t]+/gm, '')
      .replace(/`([^`\n]+)`/g, (_, body: string) => stash(body))
      // Images and links keep their visible text.
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/(\*\*|__)(.+?)\1/g, '$2')
      .replace(/~~(.+?)~~/g, '$1')
      .replace(/\*(\S(?:.*?\S)?)\*/g, '$1')
      // Underscore emphasis only at word edges, so snake_case stays intact.
      .replace(/(^|\W)_(\S(?:.*?\S)?)_(?=\W|$)/g, '$1$2')
      .replace(PLACEHOLDER, (_, index: string) => code[Number(index)])
      .replace(/\s+/g, ' ')
      .trim()
  );
}

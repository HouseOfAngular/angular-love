/**
 * WP excerpts arrive as rendered HTML fragments — tags, entities, non-breaking
 * spaces and a trailing newline. Flatten one into plain text fit for a meta
 * description / JSON-LD `description`.
 *
 * Lives next to `url-rewrite` because, like it, both the meta layer and the
 * JSON-LD builders need it.
 */
const NAMED_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&#039;': "'",
  '&nbsp;': ' ',
  '&hellip;': '…',
  '&mdash;': '—',
  '&ndash;': '–',
};

export function normalizeSeoDescription(raw: string | undefined): string {
  if (!raw) {
    return '';
  }

  return (
    raw
      // Strip markup first, so decoded entities can never form a tag.
      .replace(/<[^>]*>/g, ' ')
      .replace(
        /&[a-z]+;|&#\d+;/gi,
        (entity) => NAMED_ENTITIES[entity.toLowerCase()] ?? ' ',
      )
      // \s covers the NBSP and trailing newline WP leaves behind.
      .replace(/\s+/g, ' ')
      .trim()
  );
}

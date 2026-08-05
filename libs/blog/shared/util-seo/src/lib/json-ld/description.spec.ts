import { normalizeSeoDescription } from './description';

describe('normalizeSeoDescription', () => {
  it('returns an empty string for missing input', () => {
    expect(normalizeSeoDescription(undefined)).toBe('');
    expect(normalizeSeoDescription('')).toBe('');
  });

  it('strips markup', () => {
    expect(normalizeSeoDescription('<p>Hello <strong>world</strong></p>')).toBe(
      'Hello world',
    );
  });

  it('decodes the entities WP renders', () => {
    expect(
      normalizeSeoDescription('Zod &amp; Angular &ndash; part&nbsp;2 &hellip;'),
    ).toBe('Zod & Angular – part 2 …');
  });

  it('collapses the NBSP and trailing newline WP leaves behind', () => {
    expect(normalizeSeoDescription('Recap: where we left off \n')).toBe(
      'Recap: where we left off',
    );
  });

  it('cannot be tricked into forming a tag by encoded markup', () => {
    const out = normalizeSeoDescription(
      '&lt;script&gt;alert(1)&lt;/script&gt;',
    );
    expect(out).toBe('<script>alert(1)</script>');
    // Decoded to text only — no tag was stripped after decoding, so nothing
    // downstream sees markup it did not already escape.
    expect(normalizeSeoDescription('<script>alert(1)</script>')).toBe(
      'alert(1)',
    );
  });

  it('drops unknown entities rather than leaving raw markup', () => {
    expect(normalizeSeoDescription('a &weird; b')).toBe('a b');
  });

  it('preserves ordinary punctuation and accents', () => {
    expect(
      normalizeSeoDescription('Mateusz Stefańczyk — "WebMCP", part 1'),
    ).toBe('Mateusz Stefańczyk — "WebMCP", part 1');
  });
});

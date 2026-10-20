import { markdownToPlainText } from './markdown-text';

describe('markdownToPlainText', () => {
  it('returns an empty string for missing input', () => {
    expect(markdownToPlainText(undefined)).toBe('');
    expect(markdownToPlainText(null)).toBe('');
    expect(markdownToPlainText('')).toBe('');
  });

  it('strips emphasis', () => {
    expect(
      markdownToPlainText(
        'Signals are **sync**, *mostly*, ~~never~~ _always_.',
      ),
    ).toBe('Signals are sync, mostly, never always.');
  });

  it('keeps the visible text of links and images', () => {
    expect(
      markdownToPlainText(
        'See [the docs](https://angular.dev) and ![diagram](/a.png).',
      ),
    ).toBe('See the docs and diagram.');
  });

  it('drops block markers and joins lines', () => {
    expect(
      markdownToPlainText(
        '## Steps\n\n> Note: incremental\n\n- start small\n* go on\n1. finish',
      ),
    ).toBe('Steps Note: incremental start small go on finish');
  });

  it('keeps code verbatim, including markdown-like characters', () => {
    expect(
      markdownToPlainText(
        'Use `toSignal()` with `a*b*c`:\n\n```ts\nconst __init__ = **x**;\n```',
      ),
    ).toBe('Use toSignal() with a*b*c: const __init__ = **x**;');
  });

  it('keeps literal markup in code instead of stripping it as HTML', () => {
    expect(markdownToPlainText('Project with `<ng-content>`.')).toBe(
      'Project with <ng-content>.',
    );
  });

  it('leaves snake_case identifiers intact', () => {
    expect(markdownToPlainText('Set max_retry_count to 3.')).toBe(
      'Set max_retry_count to 3.',
    );
  });
});

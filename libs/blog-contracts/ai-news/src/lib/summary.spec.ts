import { parseAiNewsSummary } from './summary';

describe('parseAiNewsSummary', () => {
  it('splits paragraphs on blank lines and joins wrapped lines', () => {
    expect(parseAiNewsSummary('One\nstill one.\n\n\nTwo.')).toEqual([
      { kind: 'paragraph', text: 'One still one.' },
      { kind: 'paragraph', text: 'Two.' },
    ]);
  });

  it('reads lists, with or without a blank line before them', () => {
    expect(
      parseAiNewsSummary('Key points:\n- First\n* Second\n•  Third\nAfter.'),
    ).toEqual([
      { kind: 'paragraph', text: 'Key points:' },
      { kind: 'list', items: ['First', 'Second', 'Third'] },
      { kind: 'paragraph', text: 'After.' },
    ]);
  });

  it('keeps everything else as text', () => {
    expect(parseAiNewsSummary('<b>bold</b> and -not a list')).toEqual([
      { kind: 'paragraph', text: '<b>bold</b> and -not a list' },
    ]);
  });

  it('returns nothing for blank text', () => {
    expect(parseAiNewsSummary(' \n\r\n ')).toEqual([]);
  });
});

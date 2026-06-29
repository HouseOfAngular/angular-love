import { rewriteImageUrl } from './url-rewrite';

describe('rewriteImageUrl', () => {
  it.each([
    {
      input: 'https://angular.love/wp-content/uploads/cover.jpg',
      expected: 'https://wp.angular.love/wp-content/uploads/cover.jpg',
      label: 'rewrites angular.love/wp-content to wp.angular.love/wp-content',
    },
    {
      input: 'https://cdn.example.com/image.jpg',
      expected: 'https://cdn.example.com/image.jpg',
      label: 'leaves non-matching URLs unchanged',
    },
    {
      input: 'https://wp.angular.love/wp-content/uploads/cover.jpg',
      expected: 'https://wp.angular.love/wp-content/uploads/cover.jpg',
      label: 'leaves already-rewritten URLs unchanged',
    },
    {
      input: 'https://angular.love/wp-content2/uploads/cover.jpg',
      expected: 'https://angular.love/wp-content2/uploads/cover.jpg',
      label: 'leaves lookalike /wp-content2 paths unchanged',
    },
  ])('$label', ({ input, expected }) => {
    expect(rewriteImageUrl(input)).toBe(expected);
  });
});

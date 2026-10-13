import { canonicalizeUrl, getYouTubeVideoId, resolveThumbnail } from './url';

describe('canonicalizeUrl', () => {
  it.each([
    [
      'strips utm_* and click ids, keeps other params',
      'https://example.com/post?utm_source=x&UTM_Medium=y&id=3&fbclid=abc&gclid=1',
      'https://example.com/post?id=3',
    ],
    [
      'strips the fragment',
      'https://example.com/post#section-2',
      'https://example.com/post',
    ],
    [
      'strips trailing slashes',
      'https://example.com/blog/post//',
      'https://example.com/blog/post',
    ],
    [
      'strips the trailing slash of the root',
      'https://example.com/',
      'https://example.com',
    ],
    [
      'strips a leading www. and lowercases the host',
      'https://WWW.Example.COM/Path/Keeps/Case',
      'https://example.com/Path/Keeps/Case',
    ],
    [
      'keeps the port',
      'http://www.localhost:8080/a/',
      'http://localhost:8080/a',
    ],
    [
      'drops x.com share params',
      'https://x.com/someone/status/123?s=20&t=abcdef',
      'https://x.com/someone/status/123',
    ],
    [
      'keeps `t` outside of x.com',
      'https://example.com/clip?t=42',
      'https://example.com/clip?t=42',
    ],
    [
      'rewrites youtu.be links',
      'https://youtu.be/dQw4w9WgXcQ?si=share123',
      'https://youtube.com/watch?v=dQw4w9WgXcQ',
    ],
    [
      'keeps a youtu.be timestamp after v',
      'https://youtu.be/dQw4w9WgXcQ?t=30',
      'https://youtube.com/watch?v=dQw4w9WgXcQ&t=30',
    ],
    [
      'rewrites shorts',
      'https://www.youtube.com/shorts/abcDEF12345/?feature=share',
      'https://youtube.com/watch?v=abcDEF12345&feature=share',
    ],
    [
      'normalizes regular watch links',
      'https://m.youtube.com/watch?v=dQw4w9WgXcQ&utm_campaign=x#t=1',
      'https://youtube.com/watch?v=dQw4w9WgXcQ',
    ],
  ])('%s', (_, input, expected) => {
    expect(canonicalizeUrl(input)).toBe(expected);
  });

  it('is idempotent', () => {
    const once = canonicalizeUrl('https://www.youtu.be/dQw4w9WgXcQ?utm_x=1');
    expect(canonicalizeUrl(once)).toBe(once);
  });

  it('throws on an invalid URL', () => {
    expect(() => canonicalizeUrl('not a url')).toThrow();
  });
});

describe('getYouTubeVideoId', () => {
  it.each([
    ['https://youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/shorts/abcDEF12345', 'abcDEF12345'],
    ['https://youtu.be/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://youtube.com/embed/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://youtube.com/@channel', null],
    ['https://youtube.com/watch', null],
    ['https://notyoutube.com/watch?v=dQw4w9WgXcQ', null],
    ['nonsense', null],
  ])('%s → %s', (url, expected) => {
    expect(getYouTubeVideoId(url)).toBe(expected);
  });
});

describe('resolveThumbnail', () => {
  it('prefers the stored image', () => {
    expect(
      resolveThumbnail({
        url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        imageUrl: 'https://cdn.example.com/og.png',
      }),
    ).toBe('https://cdn.example.com/og.png');
  });

  it.each([
    ['https://youtube.com/watch?v=dQw4w9WgXcQ'],
    ['https://youtu.be/dQw4w9WgXcQ'],
    ['https://youtube.com/shorts/dQw4w9WgXcQ'],
  ])('uses the YouTube frame for %s', (url) => {
    expect(resolveThumbnail({ url, imageUrl: null })).toBe(
      'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    );
  });

  it('keys YouTube off the hostname, not the source type', () => {
    expect(
      resolveThumbnail({ url: 'https://example.com/watch?v=dQw4w9WgXcQ' }),
    ).toBeNull();
  });

  it.each([
    ['https://github.com/acme/widget', 'acme/widget'],
    ['https://www.github.com/acme/widget/', 'acme/widget'],
    ['https://github.com/acme/widget.git', 'acme/widget'],
  ])('uses the GitHub social card for repo root %s', (url, repo) => {
    expect(resolveThumbnail({ url })).toBe(
      `https://opengraph.githubassets.com/1/${repo}`,
    );
  });

  it.each([
    ['https://github.com/acme'],
    ['https://github.com/acme/widget/issues/42'],
    ['https://github.com/acme/widget/blob/main/README.md'],
    ['https://github.com/orgs/acme'],
    ['https://github.com/topics/llm'],
    ['https://gist.github.com/acme/abc123'],
  ])('gives non-root GitHub URL %s no image', (url) => {
    expect(resolveThumbnail({ url })).toBeNull();
  });

  it.each([
    ['https://x.com/someone/status/123'],
    ['https://arxiv.org/abs/2401.00001'],
    ['https://example.com/post'],
  ])('gives %s without an image no thumbnail', (url) => {
    expect(resolveThumbnail({ url, imageUrl: undefined })).toBeNull();
  });
});

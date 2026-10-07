import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import { WPAuthorDto, WPPostDetailsDto } from '@angular-love/util-wp';

import { initHighlighter } from '../highlighter';

import { toArticle } from './article';
import { toAuthor } from './author';

const post = (overrides: Partial<WPPostDetailsDto> = {}): WPPostDetailsDto =>
  ({
    id: 42,
    author: 7,
    status: 'publish',
    categories: [190, 204, 999],
    featured_image_url: 'https://wp.angular.love/wp-content/cover.png',
    date: '2025-01-02T10:00:00',
    modified: '2025-01-03T10:00:00',
    slug: 'my-post',
    title: { rendered: 'My &amp; post' },
    excerpt: { rendered: '<p>Short excerpt</p>' },
    content: {
      rendered: [
        '<h2>Intro</h2>',
        '<p>&nbsp;</p>',
        '<pre class="language-typescript"><code>const a = 1;</code></pre>',
        '<p><a href="https://wp.angular.love/2024/05/01/old-post/">old</a></p>',
        '<p><a href="#intro">anchor</a></p>',
        '<img src="https://angular.love/wp-content/uploads/a.png">',
        '<h3>Details</h3>',
        '<script src="https://evil.example.com/x.js"></script>',
      ].join(''),
    },
    acf: { hidden: false, reading_time: '7', difficulty: 'advanced' },
    other_translations: [{ locale: 'pl_PL', slug: 'moj-post' }],
    lang: 'en_GB',
    yoast_head_json: { title: 'SEO title', description: 'SEO description' },
    ...overrides,
  }) as WPPostDetailsDto;

describe('toArticle', () => {
  before(() => initHighlighter());

  it('maps scalar fields', () => {
    const article = toArticle(post());

    assert.equal(article.id, 42);
    assert.equal(article.title, 'My & post');
    assert.equal(article.excerpt, 'Short excerpt');
    assert.equal(article.authorId, 7);
    assert.equal(article.status, 1);
    assert.equal(article.language, 1);
    assert.equal(article.readingTime, 7);
    assert.equal(article.difficulty, 'advanced');
    assert.equal(article.isHidden, false);
    assert.deepEqual(article.publishDate, new Date('2025-01-02T10:00:00'));
    assert.deepEqual(article.otherTranslations, [
      { locale: 'pl_PL', slug: 'moj-post' },
    ]);
  });

  it('maps known category ids to slugs', () => {
    assert.deepEqual(toArticle(post()).categories, [
      'news-en',
      'recommended-en',
      undefined,
    ]);
  });

  it('collects h2/h3 anchors and ids them', () => {
    const article = toArticle(post());

    assert.deepEqual(article.anchors, [
      { title: 'Intro', type: 'h2' },
      { title: 'Details', type: 'h3' },
    ]);
    assert.match(article.content, /<h2 id="Intro">/);
  });

  it('rewrites content', () => {
    const { content } = toArticle(post());

    assert.match(content, /<pre class="shiki /);
    assert.doesNotMatch(content, /&nbsp;/);
    assert.match(content, /href="https:\/\/angular\.love\/old-post"/);
    assert.match(content, /target="_blank"/);
    assert.match(content, /href="#intro"/);
    assert.match(content, /src="https:\/\/wp\.angular\.love\/wp-content/);
    assert.doesNotMatch(content, /evil\.example\.com/);
  });

  it('keeps only whitelisted SEO fields', () => {
    const { seo } = toArticle(post());

    assert.equal(seo?.title, 'SEO title');
    assert.equal(seo?.og_title, '');
  });

  it('maps polish posts', () => {
    assert.equal(toArticle(post({ lang: 'pl_PL' })).language, 2);
  });

  it('throws on a missing locale', () => {
    assert.throws(
      () => toArticle(post({ lang: undefined as never })),
      /No locale/,
    );
  });
});

describe('toAuthor', () => {
  it('maps ACF fields and blanks to null', () => {
    const author = toAuthor({
      id: 7,
      slug: 'jane',
      name: 'Jane',
      acf: {
        acf_avatar: 'https://wp.angular.love/avatar.png',
        al_position: 'Dev',
        al_github_nickname: 'jane',
        al_twitter_handle: '',
        al_linkedin_id: '',
        al_titles: ['gde'],
        user_description_en: 'EN',
        user_description_pl: 'PL',
      },
    } as unknown as WPAuthorDto);

    assert.deepEqual(author, {
      id: 7,
      slug: 'jane',
      name: 'Jane',
      avatarUrl: 'https://wp.angular.love/avatar.png',
      position: 'Dev',
      github: 'jane',
      twitter: null,
      linkedin: null,
      titles: ['gde'],
      descriptionEn: 'EN',
      descriptionPl: 'PL',
    });
  });
});

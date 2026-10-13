import type { WPAuthorDto, WPPostDetailsDto } from '@angular-love/util-wp';

import type { WpSource } from './rebuild';

/*
  Fictional content for local development, shaped like the WordPress REST API
  responses so it goes through the same mappers as production data. The category
  ids are the WordPress ones (see `idToSlugMap` in api-turso).
*/

const CATEGORY = {
  tipsTricks: 4,
  testing: 7,
  ngrx: 10,
  angularEn: 63,
  guidesEn: 186,
  guidesPl: 188,
  newsEn: 190,
  newsPl: 192,
  recommendedEn: 204,
  recommendedPl: 206,
  inDepthPl: 214,
  inDepthEn: 216,
} as const;

const image = (seed: string, size = '1200/630') =>
  `https://picsum.photos/seed/${seed}/${size}`;

const authors: WPAuthorDto[] = [
  {
    id: 1,
    name: 'Ada Lovelace',
    slug: 'ada-lovelace',
    avatar_urls: {},
    description: '',
    acf: {
      al_position: 'Principal Engineer',
      acf_avatar: image('ada', '256/256'),
      al_github_nickname: 'ada-lovelace',
      al_twitter_handle: 'ada_lovelace',
      al_linkedin_id: 'ada-lovelace',
      al_titles: ['gde', 'key_contributor'],
      user_description_en: 'Writes about signals, performance and compilers.',
      user_description_pl: 'Pisze o sygnałach, wydajności i kompilatorach.',
    },
  },
  {
    id: 2,
    name: 'Grace Hopper',
    slug: 'grace-hopper',
    avatar_urls: {},
    description: '',
    acf: {
      al_position: 'Frontend Architect',
      acf_avatar: image('grace', '256/256'),
      al_github_nickname: 'grace-hopper',
      al_twitter_handle: '',
      al_linkedin_id: 'grace-hopper',
      al_titles: ['contributor'],
      user_description_en: 'Loves architecture, testing and clear naming.',
      user_description_pl: 'Lubi architekturę, testy i dobre nazewnictwo.',
    },
  },
  {
    id: 3,
    name: 'Linus Torvalds',
    slug: 'linus-torvalds',
    avatar_urls: {},
    description: '',
    acf: {
      al_position: 'Software Developer',
      acf_avatar: image('linus', '256/256'),
      al_github_nickname: '',
      al_twitter_handle: '',
      al_linkedin_id: '',
      al_titles: ['blogger'],
      user_description_en: 'Occasional blogger.',
      user_description_pl: 'Okazjonalny bloger.',
    },
  },
];

interface Topic {
  slug: string;
  en: string;
  pl: string;
  author: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  /** Category ids per language: [en, pl]. */
  categories: [number[], number[]];
  hidden?: boolean;
  status?: WPPostDetailsDto['status'];
  /** Only publish this language. */
  only?: 'en' | 'pl';
}

const topics: Topic[] = [
  {
    slug: 'signals-in-practice',
    en: 'Signals in practice',
    pl: 'Sygnały w praktyce',
    author: 1,
    difficulty: 'intermediate',
    categories: [
      [CATEGORY.angularEn, CATEGORY.guidesEn],
      [17, CATEGORY.guidesPl],
    ],
  },
  {
    slug: 'angular-release-notes',
    en: 'What is new in the latest Angular release',
    pl: 'Co nowego w najnowszym Angularze',
    author: 1,
    difficulty: 'beginner',
    categories: [
      [CATEGORY.angularEn, CATEGORY.newsEn],
      [17, CATEGORY.newsPl],
    ],
  },
  {
    slug: 'zoneless-change-detection',
    en: 'Zoneless change detection under the hood',
    pl: 'Zoneless change detection od środka',
    author: 1,
    difficulty: 'advanced',
    categories: [
      [CATEGORY.angularEn, CATEGORY.inDepthEn],
      [17, CATEGORY.inDepthPl],
    ],
  },
  {
    slug: 'testing-components',
    en: 'Testing components without the pain',
    pl: 'Testowanie komponentów bez bólu',
    author: 2,
    difficulty: 'beginner',
    categories: [
      [CATEGORY.angularEn, CATEGORY.testing, CATEGORY.guidesEn],
      [17, CATEGORY.testing, CATEGORY.guidesPl],
    ],
  },
  {
    slug: 'state-management-with-ngrx',
    en: 'State management with NgRx',
    pl: 'Zarządzanie stanem z NgRx',
    author: 2,
    difficulty: 'intermediate',
    categories: [
      [CATEGORY.angularEn, CATEGORY.ngrx],
      [17, CATEGORY.ngrx],
    ],
  },
  {
    slug: 'our-favourite-libraries',
    en: 'Libraries we recommend this month',
    pl: 'Biblioteki polecane w tym miesiącu',
    author: 2,
    difficulty: 'beginner',
    categories: [
      [CATEGORY.angularEn, CATEGORY.recommendedEn],
      [17, CATEGORY.recommendedPl],
    ],
  },
  {
    slug: 'tips-and-tricks',
    en: 'Ten small tips for everyday Angular',
    pl: 'Dziesięć drobnych wskazówek do Angulara',
    author: 3,
    difficulty: 'beginner',
    categories: [
      [CATEGORY.angularEn, CATEGORY.tipsTricks],
      [17, CATEGORY.tipsTricks],
    ],
  },
  {
    slug: 'dependency-injection-deep-dive',
    en: 'Dependency injection deep dive',
    pl: 'Wstrzykiwanie zależności w głąb',
    author: 1,
    difficulty: 'advanced',
    categories: [
      [CATEGORY.angularEn, CATEGORY.inDepthEn],
      [17, CATEGORY.inDepthPl],
    ],
  },
  {
    slug: 'standalone-migration',
    en: 'Migrating to standalone components',
    pl: 'Migracja do komponentów standalone',
    author: 3,
    difficulty: 'intermediate',
    categories: [
      [CATEGORY.angularEn, CATEGORY.guidesEn],
      [17, CATEGORY.guidesPl],
    ],
  },
  {
    slug: 'conference-recap',
    en: 'Conference recap',
    pl: 'Podsumowanie konferencji',
    author: 3,
    difficulty: 'beginner',
    categories: [
      [CATEGORY.angularEn, CATEGORY.newsEn],
      [17, CATEGORY.newsPl],
    ],
  },
  {
    slug: 'english-only-article',
    en: 'An article that only exists in English',
    pl: '',
    author: 2,
    difficulty: 'intermediate',
    categories: [[CATEGORY.angularEn], []],
    only: 'en',
  },
  {
    slug: 'tylko-po-polsku',
    en: '',
    pl: 'Artykuł dostępny tylko po polsku',
    author: 2,
    difficulty: 'intermediate',
    categories: [[], [17]],
    only: 'pl',
  },
  {
    slug: 'hidden-article',
    en: 'A hidden article',
    pl: 'Ukryty artykuł',
    author: 1,
    difficulty: 'beginner',
    categories: [
      [CATEGORY.angularEn, CATEGORY.guidesEn],
      [17, CATEGORY.guidesPl],
    ],
    hidden: true,
  },
  {
    slug: 'work-in-progress',
    en: 'A draft that is not published yet',
    pl: 'Szkic, który nie jest jeszcze opublikowany',
    author: 1,
    difficulty: 'beginner',
    categories: [[CATEGORY.angularEn], [17]],
    status: 'draft',
  },
];

const LOREM = {
  en: [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  ],
  pl: [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  ],
};

function content(title: string, lang: 'en' | 'pl', imageSeed: string): string {
  const [first, second] = LOREM[lang];
  return `
<p>${first}</p>
<h2>${lang === 'en' ? 'Getting started' : 'Pierwsze kroki'}</h2>
<p>${second} <a href="https://angular.dev">angular.dev</a></p>
<pre class="language-typescript"><code class="language-typescript">import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`<button (click)="increment()">{{ count() }}</button>\`,
})
export class CounterComponent {
  readonly count = signal(0);

  increment() {
    this.count.update((value) => value + 1);
  }
}</code></pre>
<h3>${lang === 'en' ? 'A closer look' : 'Bliższe spojrzenie'}</h3>
<ul>
  <li>${title}</li>
  <li><strong>${lang === 'en' ? 'Bold point' : 'Pogrubiony punkt'}</strong></li>
  <li><em>${lang === 'en' ? 'Emphasised point' : 'Wyróżniony punkt'}</em></li>
</ul>
<img src="${image(imageSeed, '800/450')}" alt="${title}" width="800" height="450" />
<h2>${lang === 'en' ? 'Summary' : 'Podsumowanie'}</h2>
<blockquote><p>${first}</p></blockquote>
`.trim();
}

const BASE_DATE = Date.UTC(2025, 0, 6, 9, 0, 0);
const DAY = 24 * 60 * 60 * 1000;

const translationLocale = { en: 'en_GB', pl: 'pl_PL' } as const;

function buildPosts(): WPPostDetailsDto[] {
  const posts: WPPostDetailsDto[] = [];
  let id = 100;

  topics.forEach((topic, index) => {
    const date = new Date(BASE_DATE + index * 9 * DAY).toISOString();
    const languages = (['en', 'pl'] as const).filter(
      (lang) => !topic.only || topic.only === lang,
    );
    const slugFor = (lang: 'en' | 'pl') =>
      topic.only ? topic.slug : lang === 'en' ? topic.slug : `${topic.slug}-pl`;
    const author = authors.find((a) => a.id === topic.author) as WPAuthorDto;

    for (const lang of languages) {
      const title = topic[lang];
      const slug = slugFor(lang);
      const excerpt = `<p>${LOREM[lang][0]}</p>`;
      const other = languages.filter((l) => l !== lang);

      posts.push({
        id: id++,
        author: topic.author,
        status: topic.status ?? 'publish',
        categories: topic.categories[lang === 'en' ? 0 : 1],
        featured_image_url: image(topic.slug),
        date,
        modified: date,
        slug,
        title: { rendered: title },
        content: { rendered: content(title, lang, topic.slug) },
        excerpt: { rendered: excerpt },
        author_details: {
          name: author.name,
          slug: author.slug,
          avatar_url: author.acf.acf_avatar,
          description: author.acf.user_description_en,
          position: author.acf.al_position,
          github: author.acf.al_github_nickname,
          twitter: author.acf.al_twitter_handle,
          linkedin: author.acf.al_linkedin_id,
          titles: author.acf.al_titles,
        },
        acf: {
          hidden: topic.hidden ?? false,
          reading_time: 4 + (index % 8),
          difficulty: topic.difficulty,
        },
        other_translations: other.map((l) => ({
          locale: translationLocale[l],
          slug: slugFor(l),
        })),
        lang: translationLocale[lang],
        yoast_head_json: {
          title: `${title} - Angular.love`,
          description: LOREM[lang][0],
          og_title: title,
          og_description: LOREM[lang][0],
          og_type: 'article',
          og_locale: translationLocale[lang],
          og_site_name: 'Angular.love',
          article_modified_time: date,
        },
      });
    }
  });

  return posts;
}

const posts = buildPosts();

/** Stands in for WordPress when building a database without access to it. */
export const seedWp: WpSource = {
  authorIds: async () => authors.map((a) => a.id),
  postIds: async () => posts.map((p) => p.id),
  author: async (id) => ({
    data: authors.find((a) => a.id === id) as WPAuthorDto,
  }),
  post: async (id) => ({
    data: posts.find((p) => p.id === id) as WPPostDetailsDto,
  }),
};

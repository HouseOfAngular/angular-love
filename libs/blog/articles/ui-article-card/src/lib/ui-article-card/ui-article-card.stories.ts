import { provideTransloco, translocoConfig } from '@jsverse/transloco';
import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';

import { TranslocoHttpLoader } from '@angular-love/blog/i18n/data-access';
import { AlLocalizeService } from '@angular-love/blog/i18n/util';
import { ArticleCard } from '@angular-love/blog/shared/types';

import { ArticleCompactCardComponent } from '../components/article-compact-card/article-compact-card.component';
import { ArticleHeroCardComponent } from '../components/article-hero-card/article-hero-card.component';
import { ArticleHorizontalCardComponent } from '../components/article-horizontal-card/article-horizontal-card.component';
import { ArticleRegularCardComponent } from '../components/article-regular-card/article-regular-card.component';

import { UiArticleCardComponent } from './ui-article-card.component';

const article: ArticleCard = {
  title: 'Angular Storybook',
  readingTime: '3',
  excerpt:
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. ',
  featuredImageUrl: '/assets/storybook/article-featured-image.png',
  difficulty: 'intermediate',
  author: {
    name: 'Author Data',
    avatarUrl: '/assets/storybook/author-image.jpg',
  },
  slug: 'angular-storybook',
  publishDate: new Date('2021-05-01').toISOString(),
};

const translocoConf = translocoConfig({
  availableLangs: ['pl', 'en'],
  defaultLang: 'pl',
});

const meta: Meta<UiArticleCardComponent> = {
  component: UiArticleCardComponent,
  subcomponents: {
    ArticleUiCardComponent: ArticleRegularCardComponent,
    ArticleCompactCardComponent: ArticleCompactCardComponent,
    ArticleHeroCardComponent: ArticleHeroCardComponent,
    ArticleHorizontalCardComponent: ArticleHorizontalCardComponent,
  },
  title: 'Articles / UiArticleCardComponent',
  decorators: [
    moduleMetadata({
      imports: [
        ArticleRegularCardComponent,
        ArticleCompactCardComponent,
        ArticleHeroCardComponent,
        ArticleHorizontalCardComponent,
      ],
      providers: [AlLocalizeService],
    }),

    applicationConfig({
      providers: [
        provideTransloco({
          config: translocoConf,
          loader: TranslocoHttpLoader,
        }),
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<UiArticleCardComponent>;

export const compact: Story = {
  args: {
    article: article,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 405px;">
        <al-article-compact-card [article]="article"></al-article-compact-card>
      </div>
    `,
  }),
};

export const hero: Story = {
  args: {
    article: article,
  },
  render: (args) => ({
    props: args,
    template: `
     <div style="width: 816px;">
       <al-article-hero-card [article]="article"></al-article-hero-card>
     </div>`,
  }),
};

export const horizontal: Story = {
  args: {
    article: article,
  },
  render: (args) => ({
    props: args,
    template: `
     <div style="height: 230px;">
        <al-article-horizontal-card [article]="article"></al-article-horizontal-card>
     </div>`,
  }),
};

export const regular: Story = {
  args: {
    article: article,
  },
  render: (args) => ({
    props: args,
    template: `
     <div style="width: 405px; height: 514px;">
        <al-article-regular-card [article]="article"></al-article-regular-card>
     </div>`,
  }),
};

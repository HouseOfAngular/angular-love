import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { ArticleCard } from '@angular-love/blog/shared/types';

import { ArticleBackgroundCardComponent } from '../components/article-background-card/article-background-card.component';
import { ArticleRegularCardComponent } from '../components/article-regular-card/article-regular-card.component';

import { CardType, UiArticleCardComponent } from './ui-article-card.component';

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

const layoutCompact: CardType = 'compact';
const layoutHero: CardType = 'hero';
const layoutRegular: CardType = 'regular';
const layoutHorizontal: CardType = 'horizontal';

const meta: Meta<UiArticleCardComponent> = {
  component: UiArticleCardComponent,
  subcomponents: {
    ArticleUiBackgroundCardComponent: ArticleBackgroundCardComponent,
    ArticleUiCardComponent: ArticleRegularCardComponent,
  },
  title: 'Articles / UiArticleCardComponent',
  decorators: [
    moduleMetadata({
      imports: [ArticleBackgroundCardComponent, ArticleRegularCardComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<UiArticleCardComponent>;

export const compact: Story = {
  args: {
    article: article,
    cardType: layoutCompact,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="w-[408px] h-[232px]">
        <al-article-regular-card [article]="article" [cardType]="cardType">
          <al-article-background-card [article]="article" [layout]="cardType.layout"></al-article-background-card>
        </al-article-regular-card>
      </div>
    `,
  }),
};

export const hero: Story = {
  args: {
    article: article,
    cardType: layoutHero,
  },
  render: (args) => ({
    props: args,
    template: `
     <div class="h-[430px]">
      <al-article-regular-card [article]="article" [cardType]="cardType">
        <al-article-background-card [article]="article" [layout]="cardType.layout"></al-article-background-card>
      </al-article-regular-card>
     </div>`,
  }),
};

export const horizontal: Story = {
  args: {
    article: article,
    cardType: layoutHorizontal,
  },
  render: (args) => ({
    props: args,
    template: `
     <div style="width: 100%; height: 230px;">
      <al-article-regular-card [article]="article" [cardType]="cardType">
        <al-article-regular-card [article]="article" [layout]="cardType.layout"></al-article-regular-card>
      </al-article-regular-card>
     </div>`,
  }),
};

export const regular: Story = {
  args: {
    article: article,
    cardType: layoutRegular,
  },
  render: (args) => ({
    props: args,
    template: `
     <div style="width: 460px; height: 600px;">
      <al-article-regular-card [article]="article" [cardType]="cardType">
        <al-article-regular-card [article]="article" [layout]="cardType.layout"></al-article-regular-card>
      </al-article-regular-card>
     </div>`,
  }),
};

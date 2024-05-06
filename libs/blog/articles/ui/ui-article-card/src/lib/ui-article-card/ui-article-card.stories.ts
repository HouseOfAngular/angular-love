import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { ArticleUiBackgroundCardComponent } from './components/background-card/article-ui-background-card.component';
import { ArticleUiCardComponent } from './components/card/article-ui-card.component';
import { CardType, UiArticleCardComponent } from './ui-article-card.component';

const article = {
  title: 'Angular Storybook',
  readingTime: 3,
  excerpt:
    'The micro frontend architecture is a well-known development approach.',
  featuredImageUrl: '/assets/storybook/article-featured-image.png',
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
    ArticleUiBackgroundCardComponent: ArticleUiBackgroundCardComponent,
    ArticleUiCardComponent: ArticleUiCardComponent,
  },
  title: 'Articles / UiArticleCardComponent',
  decorators: [
    moduleMetadata({
      imports: [ArticleUiBackgroundCardComponent, ArticleUiCardComponent],
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
        <al-ui-article-card [article]="article" [cardType]="cardType">
          <al-article-ui-background-card [article]="article" [layout]="cardType.layout"></al-article-ui-background-card>
        </al-ui-article-card>
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
      <al-ui-article-card [article]="article" [cardType]="cardType">
        <al-article-ui-background-card [article]="article" [layout]="cardType.layout"></al-article-ui-background-card>
      </al-ui-article-card>
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
      <al-ui-article-card [article]="article" [cardType]="cardType">
        <al-article-ui-card [article]="article" [layout]="cardType.layout"></al-article-ui-card>
      </al-ui-article-card>
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
      <al-ui-article-card [article]="article" [cardType]="cardType">
        <al-article-ui-card [article]="article" [layout]="cardType.layout"></al-article-ui-card>
      </al-ui-article-card>
     </div>`,
  }),
};

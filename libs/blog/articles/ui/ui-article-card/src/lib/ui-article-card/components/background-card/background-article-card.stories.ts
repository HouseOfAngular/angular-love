import { Meta, StoryObj } from '@storybook/angular';
import {
  BackgroundArticleCardComponent,
  UiArticleCardDataModel,
  Layout,
} from './background-article-card.component';

const meta: Meta<BackgroundArticleCardComponent> = {
  component: BackgroundArticleCardComponent,
  title: 'Articles / BackgroundArticleCardComponent',
};

const article: UiArticleCardDataModel = {
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

const layout: Layout = 'PRIMARY';

export default meta;
type Story = StoryObj<BackgroundArticleCardComponent>;
const template = `
    <al-background-article-card [article]="article" [layout]="layout"></al-background-article-card>
`;

export const primary: Story = {
  args: {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    article: article as any, //TO-DO-REMOVE-WHEN-STORYBOOK-UPDATED//
    layout: layout as any, //TO-DO-REMOVE-WHEN-STORYBOOK-UPDATED//
  },
  render: (args: BackgroundArticleCardComponent) => ({
    props: args,
    template,
  }),
};

import { Meta, StoryObj } from '@storybook/angular';
import { SmallArticleCardComponent } from './small-article-card.component';
import { SmallArticleCardDataModel } from '@angular-love/small-article-card-data-model';

const meta: Meta<SmallArticleCardComponent> = {
  component: SmallArticleCardComponent,
  title: 'Articles / SmallArticleCardComponent',
};

const article: SmallArticleCardDataModel = {
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
};

export default meta;
type Story = StoryObj<SmallArticleCardComponent>;
const template = `
    <al-small-article-card [article]="article"></al-small-article-card>
`;

export const primary: Story = {
  args: {
    article: article,
  },
  render: (args) => ({
    props: args,
    template,
  }),
};

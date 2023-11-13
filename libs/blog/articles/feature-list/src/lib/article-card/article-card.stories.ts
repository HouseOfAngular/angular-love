import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ArticleCardComponent, UiArticleCard } from './article-card.component';
import { ArticleCardSkeletonComponent } from './article-card-skeleton.component';

const meta: Meta<ArticleCardComponent> = {
  component: ArticleCardComponent,
  title: 'Articles / Article Card',
  decorators: [
    moduleMetadata({
      imports: [ArticleCardSkeletonComponent],
    }),
  ],
};

const articleCard: UiArticleCard = {
  title: 'Angular Storybook',
  publishDate: new Date('2021-01-01').toISOString(),
  excerpt:
    'Consider User Interface (UI) as an independent standalone layer made of small and reusable blocks -> first class citizens of every Angular app. Such an approach is called Component …',
  featuredImageUrl: '/assets/storybook/article-featured-image.png',
  author: {
    name: 'Mateusz Dobrowolski',
    avatarUrl: '/assets/storybook/author-image.jpg',
  },
};

export default meta;
type Story = StoryObj<ArticleCardComponent>;
const template = `
  <div style="display: flex; gap: 16px; padding: 16px; align-items: flex-start" >
    <angular-love-article-card style="width: 300px;" [articleCard]="articleCard"></angular-love-article-card>
    <!-- TODO skeleton -->
    <angular-love-article-card-skeleton style="width: 300px;"></angular-love-article-card-skeleton>
</div>
`;

export const primary: Story = {
  args: {
    articleCard,
  },
  render: (args: ArticleCardComponent) => ({
    props: args,
    template,
  }),
};

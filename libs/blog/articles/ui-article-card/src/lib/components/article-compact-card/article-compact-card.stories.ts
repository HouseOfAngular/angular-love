import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import {
  article,
  articleCardAppConfig,
  articleCardProviders,
} from '../article-card-story.setup';

import { ArticleCompactCardComponent } from './article-compact-card.component';

const meta: Meta<ArticleCompactCardComponent> = {
  component: ArticleCompactCardComponent,
  title: 'Articles / Compact Card',
  decorators: [
    moduleMetadata({ providers: articleCardProviders }),
    articleCardAppConfig,
  ],
};

export default meta;
type Story = StoryObj<ArticleCompactCardComponent>;

export const Default: Story = {
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

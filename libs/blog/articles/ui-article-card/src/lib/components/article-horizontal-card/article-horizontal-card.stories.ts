import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import {
  article,
  articleCardAppConfig,
  articleCardProviders,
} from '../article-card-story.setup';

import { ArticleHorizontalCardComponent } from './article-horizontal-card.component';

const meta: Meta<ArticleHorizontalCardComponent> = {
  component: ArticleHorizontalCardComponent,
  title: 'Articles / Horizontal Card',
  decorators: [
    moduleMetadata({ providers: articleCardProviders }),
    articleCardAppConfig,
  ],
};

export default meta;
type Story = StoryObj<ArticleHorizontalCardComponent>;

export const Default: Story = {
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

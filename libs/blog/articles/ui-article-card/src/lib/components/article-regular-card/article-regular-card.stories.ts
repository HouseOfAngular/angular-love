import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import {
  article,
  articleCardAppConfig,
  articleCardProviders,
} from '../article-card-story.setup';

import { ArticleRegularCardComponent } from './article-regular-card.component';

const meta: Meta<ArticleRegularCardComponent> = {
  component: ArticleRegularCardComponent,
  title: 'Articles / Regular Card',
  decorators: [
    moduleMetadata({ providers: articleCardProviders }),
    articleCardAppConfig,
  ],
};

export default meta;
type Story = StoryObj<ArticleRegularCardComponent>;

export const Default: Story = {
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

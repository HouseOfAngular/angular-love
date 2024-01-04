import type { Meta, StoryObj } from '@storybook/angular';
import { ArticleDetailsSkeletonComponent } from './article-details-skeleton.component';

const meta: Meta<ArticleDetailsSkeletonComponent> = {
  component: ArticleDetailsSkeletonComponent,
  title: 'Articles / details skeleton',
};

export default meta;
type Story = StoryObj<ArticleDetailsSkeletonComponent>;

export const primary: Story = {
  args: {},
};

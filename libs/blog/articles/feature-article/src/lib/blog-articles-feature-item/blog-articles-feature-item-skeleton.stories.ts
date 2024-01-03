import type { Meta, StoryObj } from '@storybook/angular';
import { BlogArticlesFeatureItemSkeletonComponent } from './blog-articles-feature-item-skeleton.component';

const meta: Meta<BlogArticlesFeatureItemSkeletonComponent> = {
  component: BlogArticlesFeatureItemSkeletonComponent,
  title: 'Articles / details skeleton',
};

export default meta;
type Story = StoryObj<BlogArticlesFeatureItemSkeletonComponent>;

export const primary: Story = {
  args: {},
};

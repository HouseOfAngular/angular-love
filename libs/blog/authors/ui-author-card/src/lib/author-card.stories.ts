import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { AuthorCardSkeletonComponent } from './author-card-skeleton.component';
import { AuthorCardComponent, UiAuthorCard } from './author-card.component';

const meta: Meta<AuthorCardComponent> = {
  component: AuthorCardComponent,
  title: 'Authors / Author Card',
  decorators: [
    moduleMetadata({
      imports: [AuthorCardSkeletonComponent],
    }),
  ],
};

const author: UiAuthorCard = {
  name: 'John Smith',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  avatarUrl: '/assets/storybook/author-image.jpg',
  position: '',
  slug: '',
};

export default meta;
type Story = StoryObj<AuthorCardComponent>;
const template = `
  <div style="display: flex; gap: 16px; padding: 16px; align-items: flex-start" >
    <!-- standard card -->
    <al-author-card style="width: 300px;" [author]="author"></al-author-card>
    <!-- loading skeleton -->
    <al-author-card-skeleton style="width: 300px;"></al-author-card-skeleton>
</div>
`;

export const primary: Story = {
  args: {
    author,
  },
  render: (args) => ({
    props: args,
    template,
  }),
};

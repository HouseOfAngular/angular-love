import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { AuthorCardComponent, UiAuthorCard } from './author-card.component';
import { AuthorCardSkeletonComponent } from './author-card-skeleton.component';

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
  render: (args: AuthorCardComponent) => ({
    props: args,
    template,
  }),
};

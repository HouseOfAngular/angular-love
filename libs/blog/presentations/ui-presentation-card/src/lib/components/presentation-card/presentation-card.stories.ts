import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { PresentationPreview } from '@angular-love/blog-contracts/presentations';

import { PresentationCardSkeletonComponent } from './presentation-card-skeleton.component';
import { PresentationCardComponent } from './presentation-card.component';

const presentation: PresentationPreview = {
  slug: 'lazy-but-fast-how-taking-it-slow-can-speed-up-your-app',
  title: 'Lazy, but Fast: How Taking It Slow Can Speed Up Your App!',
  excerpt:
    'Learn how lazy loading can actually improve your application performance.',
  featuredImageUrl: 'https://via.placeholder.com/405x228',
  publishDate: '2025-03-15',
  author: {
    name: 'Jarosław Żołnowski',
    slug: 'jaroslaw-zolnowski',
    avatarUrl: 'https://via.placeholder.com/150',
  },
};

const meta: Meta<PresentationCardComponent> = {
  component: PresentationCardComponent,
  title: 'Presentations / PresentationCard',
  decorators: [
    moduleMetadata({
      imports: [PresentationCardSkeletonComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<PresentationCardComponent>;

export const Default: Story = {
  args: {
    presentation: presentation,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 405px;">
        <al-presentation-card [presentation]="presentation" />
      </div>
    `,
  }),
};

export const Skeleton: StoryObj<PresentationCardSkeletonComponent> = {
  render: () => ({
    template: `
      <div style="width: 405px;">
        <al-presentation-card-skeleton />
      </div>
    `,
  }),
};

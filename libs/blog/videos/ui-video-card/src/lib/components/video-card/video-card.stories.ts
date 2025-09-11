import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import { VideoCard } from '../../types/video-card';

import { VideoCardSkeletonComponent } from './video-card-skeleton.component';
import { VideoCardComponent } from './video-card.component';

const video: VideoCard = {
  videoId: 'PAXESli1Ztw',
  title: 'Lazy but fast...',
  eventName: 'Angular Spring Camp 2025',
};

const meta: Meta<VideoCardComponent> = {
  component: VideoCardComponent,
  title: 'Videos / VideoCard',
  decorators: [
    moduleMetadata({
      imports: [VideoCardSkeletonComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<VideoCardComponent>;

export const Default: Story = {
  args: {
    video: video,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 405px;">
        <al-video-card [video]="video" videoPlayerTitle="YouTube video player" />
      </div>
    `,
  }),
};

export const Skeleton: StoryObj<VideoCardSkeletonComponent> = {
  args: {
    video: video,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 405px;">
        <al-video-card-skeleton />
      </div>
    `,
  }),
};

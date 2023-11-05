import type { Meta, StoryObj } from '@storybook/angular';
import { SocialMediaIconsComponent } from './social-media-icons.component';

const meta: Meta<SocialMediaIconsComponent> = {
  component: SocialMediaIconsComponent,
  title: 'Shared UI / Social Media Icons',
};

export default meta;

type Story = StoryObj<SocialMediaIconsComponent>;

export const icons: Story = {
  render: () => ({
    template: `
      <div>
        <angular-love-social-media-icons />
        <angular-love-social-media-icons size="18" />
        <angular-love-social-media-icons size="20" />
      </div>
    `,
  }),
};

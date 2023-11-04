import type { Meta, StoryObj } from '@storybook/angular';
import { FooterComponent } from './footer.component';
import { moduleMetadata } from '@storybook/angular';
import { NgIconComponent } from '@ng-icons/core';

const meta: Meta<FooterComponent> = {
  component: FooterComponent,
  title: 'Components / Footer',
  decorators: [
    moduleMetadata({
      imports: [NgIconComponent],
    }),
  ],
};
export default meta;
type Story = StoryObj<FooterComponent>;

export const Primary: Story = {
  args: {},
};

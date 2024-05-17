import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroUsers } from '@ng-icons/heroicons/outline';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  component: ButtonComponent,
  title: 'Shared ui / Buttons',
  decorators: [
    moduleMetadata({
      imports: [NgIconComponent],
      providers: [provideIcons({ heroUsers })],
    }),
  ],
};

export default meta;
type Story = StoryObj<ButtonComponent>;
const template = `
    <div style="display: flex; gap: 16px; padding: 16px;">
        <button al-button [variant]="variant" [size]="size">label</button>
        <a href="#" al-button [variant]="variant" [size]="size">other</a>
        <button al-button [variant]="variant" [size]="size">
            <ng-icon name="heroUsers"></ng-icon>
            <span>click me</span>
        </button>
    </div>
`;

export const primary: Story = {
  args: {
    variant: 'Primary',
    size: 'medium',
  },
  render: (args) => ({
    props: args,
    template,
  }),
};

export const outline: Story = {
  args: {
    variant: 'Outline',
    size: 'medium',
  },
  render: (args) => ({
    props: args,
    template,
  }),
};

export const ghost: Story = {
  args: {
    variant: 'Ghost',
    size: 'medium',
  },
  render: (args) => ({
    props: args,
    template,
  }),
};

export const small: Story = {
  args: {
    variant: 'Outline',
    size: 'small',
  },
  render: (args) => ({
    props: args,
    template,
  }),
};

export const large: Story = {
  args: {
    variant: 'Outline',
    size: 'large',
  },
  render: (args) => ({
    props: args,
    template,
  }),
};

import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';
import {moduleMetadata} from '@storybook/angular';
import {NgIconComponent, provideIcons} from '@ng-icons/core';
import { heroUsers } from "@ng-icons/heroicons/outline";

const meta: Meta<ButtonComponent> = {
  component: ButtonComponent,
  title: 'Shared UI / Buttons',
  decorators: [
    moduleMetadata({
      imports: [NgIconComponent],
      providers: [
        provideIcons({ heroUsers })
      ]
    }),
  ],

};

export default meta;
type Story = StoryObj<ButtonComponent>;
const template = `
    <div style="display: flex; gap: 16px; padding: 16px;">
        <button al-button [variant]="variant">label</button>
        <a href="#" al-button [variant]="variant">other</a>
        <button al-button [variant]="variant">
            <ng-icon name="heroUsers"></ng-icon>
            <span>click me</span>
        </button>
    </div>
`;

export const primary: Story = {
  args: {
    variant: 'Primary',
  },
  render: (args: ButtonComponent) => ({
    props: args,
    template,
  }),
};

export const secondary: Story = {
  args: {
    variant: 'Secondary',
  },
  render: (args: ButtonComponent) => ({
    props: args,
    template,
  }),
};

export const outline: Story = {
  args: {
    variant: 'Outline',
  },
  render: (args: ButtonComponent) => ({
    props: args,
    template,
  }),
};


import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  component: ButtonComponent,
  title: 'Shared UI / Buttons',
};
export default meta;
type Story = StoryObj<ButtonComponent>;
const template = `
    <div style="display: flex; gap: 16px; padding: 16px;">
        <button al-button>label</button>
        <a href="" al-button>Primary</a>
    </div>
`;

export const Primary: Story = {
  args: {},
  render: (args: ButtonComponent) => ({
    props: args,
    template,
  }),
};

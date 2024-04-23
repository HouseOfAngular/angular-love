import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta<undefined> = {
  title: 'Shared ui / Typography',
};

export default meta;
type Story = StoryObj<undefined>;
const template = `
    <h1 class="text-4xl">Typography:</h1>
    <div style="display: flex; flex-direction: column; gap: 16px; padding: 16px; color: var(--color-primary)">
        <span class="text-xs">text-xs</span>
        <span class="text-sm">text-sm</span>
        <span class="text-base">text-base</span>
        <span class="text-lg">text-lg</span>
        <span class="text-xl">text-xl</span>
        <span class="text-2xl">text-2xl</span>
        <span class="text-3xl">text-3xl</span>
        <span class="text-4xl">text-4xl</span>
        <span class="text-5xl">text-5xl</span>
        <span class="text-6xl">text-6xl</span>
        <span class="text-7xl">text-7xl</span>
        <span class="text-8xl">text-8xl</span>
        <span class="text-9xl">text-9xl</span>
    </div>
`;

export const primary: Story = {
  args: undefined,
  render: (args) => ({
    props: args,
    template,
  }),
};

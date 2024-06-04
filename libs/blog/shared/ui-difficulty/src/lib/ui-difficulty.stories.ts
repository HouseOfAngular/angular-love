import type { Meta, StoryObj } from '@storybook/angular';

import { UiDifficultyComponent } from './ui-difficulty.component';

const meta: Meta<UiDifficultyComponent> = {
  component: UiDifficultyComponent,
  title: 'Shared UI / Difficulty',
};

export default meta;
type Story = StoryObj<UiDifficultyComponent>;
const template = `
    <div class="bg-al-card" style="display: flex; gap: 16px; padding: 16px;">
      <div style="display: flex; flex-direction: column; gap: 16px">
        <al-difficulty [difficulty]="'beginner'" />
        <al-difficulty [difficulty]="'intermediate'" />
        <al-difficulty [difficulty]="'advanced'" />
      </div>

      <div style="display: flex; flex-direction: column; gap: 16px">
        <al-difficulty [difficulty]="'beginner'" [color]="'border'" />
        <al-difficulty [difficulty]="'intermediate'" [color]="'border'" />
        <al-difficulty [difficulty]="'advanced'" [color]="'border'" />
      </div>
    </div>
`;

export const Default: Story = {
  render: () => ({
    template,
  }),
};

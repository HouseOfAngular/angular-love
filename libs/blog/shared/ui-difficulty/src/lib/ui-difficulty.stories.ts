import { provideTransloco, translocoConfig } from '@jsverse/transloco';
import { applicationConfig, Meta, StoryObj } from '@storybook/angular';

import { TranslocoHttpLoader } from '@angular-love/blog/i18n/data-access';

import { UiDifficultyComponent } from './ui-difficulty.component';

const translocoConf = translocoConfig({
  availableLangs: ['pl', 'en'],
  defaultLang: 'pl',
});

const meta: Meta<UiDifficultyComponent> = {
  component: UiDifficultyComponent,
  title: 'Shared UI / Difficulty',
  decorators: [
    applicationConfig({
      providers: [
        provideTransloco({
          config: translocoConf,
          loader: TranslocoHttpLoader,
        }),
      ],
    }),
  ],
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

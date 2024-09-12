import { provideTransloco, translocoConfig } from '@jsverse/transloco';
import { applicationConfig, Meta, StoryObj } from '@storybook/angular';

import { TranslocoHttpLoader } from '@angular-love/blog/i18n/data-access';

import { PaginationComponent } from './pagination.component';

const translocoConf = translocoConfig({
  availableLangs: ['pl', 'en'],
  defaultLang: 'pl',
});

const meta: Meta<PaginationComponent> = {
  component: PaginationComponent,
  title: 'Shared UI / Pagination',
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
type Story = StoryObj<PaginationComponent>;

export const Primary: Story = {
  args: {
    total: 100,
    skip: 0,
    pageSize: 10,
  },
};

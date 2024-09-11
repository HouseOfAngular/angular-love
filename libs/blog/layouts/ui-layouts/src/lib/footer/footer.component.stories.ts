import { provideTransloco, translocoConfig } from '@jsverse/transloco';
import { NgIconComponent } from '@ng-icons/core';
import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';

import { TranslocoHttpLoader } from '@angular-love/blog/i18n/data-access';

import { FooterComponent } from './footer.component';

const translocoConf = translocoConfig({
  availableLangs: ['pl', 'en'],
  defaultLang: 'pl',
});

const meta: Meta<FooterComponent> = {
  component: FooterComponent,
  title: 'Components / Footer',
  decorators: [
    moduleMetadata({
      imports: [NgIconComponent],
    }),
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
type Story = StoryObj<FooterComponent>;

export const Primary: Story = {
  args: {},
};

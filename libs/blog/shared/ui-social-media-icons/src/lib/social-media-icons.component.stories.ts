import { provideTransloco, translocoConfig } from '@jsverse/transloco';
import { applicationConfig, Meta, StoryObj } from '@storybook/angular';

import { TranslocoHttpLoader } from '@angular-love/blog/i18n/data-access';

import { SocialMediaIconsComponent } from './social-media-icons.component';

const translocoConf = translocoConfig({
  availableLangs: ['pl', 'en'],
  defaultLang: 'pl',
});

const meta: Meta<SocialMediaIconsComponent> = {
  component: SocialMediaIconsComponent,
  title: 'Shared ui / Social Media Icons',
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

type Story = StoryObj<SocialMediaIconsComponent>;

export const icons: Story = {
  render: () => ({
    template: `
      <div>
        <al-social-media-icons />
        <al-social-media-icons size="18" />
        <al-social-media-icons size="20" />
      </div>
    `,
  }),
};

import { provideTransloco, translocoConfig } from '@jsverse/transloco';
import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { TranslocoHttpLoader } from '@angular-love/blog/i18n/data-access';

import { TableOfContentsScrollSpyDirective } from './table-of-contents-scroll-spy.directive';
import { TableOfContentsComponent } from './table-of-contents.component';

const translocoConf = translocoConfig({
  availableLangs: ['pl', 'en'],
  defaultLang: 'pl',
});

const meta: Meta<TableOfContentsComponent> = {
  component: TableOfContentsComponent,
  title: 'Articles / Table of contents',
  decorators: [
    moduleMetadata({
      imports: [TableOfContentsScrollSpyDirective],
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
type Story = StoryObj<TableOfContentsComponent>;

export const primary: Story = {
  args: {
    activeAnchorTitle: 'Signals in Angular 16',
    anchors: [
      {
        title:
          'Signals in Angls in Angls in Angls in Angls in Angls in Angls in Angls in Angls in Angls in Angls in Angls in Angular 16',
        type: 'h3',
      },
      {
        title: 'Server-side rendering',
        type: 'h2',
      },
      {
        title: 'Required Inputs',
        type: 'h3',
      },
      {
        title: 'Router Inputs',
        type: 'h3',
      },
      {
        title: 'esbuild dev server',
        type: 'h2',
      },
      {
        title: 'Other notable changes in Angular 16',
        type: 'h3',
      },
      {
        title: 'What’s next after Angular 16?',
        type: 'h3',
      },
      {
        title: 'Summary',
        type: 'h2',
      },
    ],
  },
};

export const withScrollSpy: Story = {
  args: {
    ...primary.args,
  },
  render: (args) => ({
    template: `
      <div #scrollContainer class="flex min-h-[400px] h-[70vh] gap-10 overflow-y-scroll p-10 border border-al-muted rounded-sm">
        <div class="flex flex-col gap-[250px]  p-10">
          <h1 id="Signals in Angular 16">Signals in Angular 16</h1>
          <h1 id="Server-side rendering">Server-side rendering</h1>
          <h1 id="Required Inputs">Required Inputs</h1>
          <h1 id="Router Inputs">Router Inputs</h1>
          <h1 id="esbuild dev server">esbuild dev server</h1>
          <h1 id="Other notable changes in Angular 16">
            Other notable changes in Angular 16
          </h1>
          <h1 id="What’s next after Angular 16?">What’s next after Angular 16?</h1>
          <h1 class="pb-[500px]" id="Summary">Summary</h1>
        </div>
        <al-table-of-contents
          alTableOfContentsScrollSpy
          class="sticky top-0 ml-auto w-[400px]"
          [anchors]="anchors"
          [activeAnchorTitle]="activeAnchorTitle"
          [scrollContainer]="scrollContainer"
        />
      </div>

    `,
    props: args,
  }),
};

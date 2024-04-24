import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { AuthorInfoComponent } from './author-info.component';
import { AuthorInfoSkeletonComponent } from './author-info-skeleton.component';
import { UiAuthorInfo } from '@angular-love/blog/authors/types/author-info-data-model';

const meta: Meta<AuthorInfoComponent> = {
  component: AuthorInfoComponent,
  title: 'Authors / Author Info',
  decorators: [
    moduleMetadata({
      imports: [AuthorInfoSkeletonComponent],
    }),
    componentWrapperDecorator((story) => `<div class="p-4">${story}</div>`),
  ],
};

const author: UiAuthorInfo = {
  name: 'John Smith',
  description:
    'Jestem full-stack web Podczas moich 14 lat kodowania zdobyłem ogr,ydajności.\r\n\r\nZdając sobie sprawę z tego, jak szybko rozwija się informatyka i aspekty techniczne, staram się być na bieżąco, uczestnicząc w konferencjach i meetupach, studiując i próbując nowych technologii. Uwielbiam dzielić się swoją wiedzą i pomagać innym programistom.\r\n\r\n"Sharing is Caring"\r\n\r\nUczę Angulara w firmach korporacyjnych poprzez instytut Code.Hub, piszę artykuły i tworzę filmy na YouTube.',
  avatarUrl: '/assets/storybook/author-image.jpg',
  position: 'Full-stack web developer',
};

export default meta;
type Story = StoryObj<AuthorInfoComponent>;

export const primary: Story = {
  args: {
    author: author as any, //TODO: fix when storybook supports signal inputs
  },
  render: (args: AuthorInfoComponent) => ({
    props: args,
    template: `
       <div class="flex gap-4 flex-col">
        <al-author-info [author]="author"/>
        <al-author-info-skeleton/>
      </div>`,
  }),
};

export const skeleton: Story = {
  args: {},
  render: (args: AuthorInfoSkeletonComponent) => ({
    props: args,
    template: `
    <al-author-info-skeleton/>
  `,
  }),
};

const longText =
  'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur';

export const withToLongData: Story = {
  args: {
    author: {
      name: longText,
      description: longText.repeat(10),
      position: longText,
      avatarUrl: '/assets/storybook/author-image.jpg',
    } as any, //TODO: fix when storybook supports signal inputs
  },
};

export const withEmptyData: Story = {
  args: {
    author: {
      name: '',
      description: '',
      position: '',
      avatarUrl: '',
    } as any, //TODO: fix when storybook supports signal inputs
  },
};

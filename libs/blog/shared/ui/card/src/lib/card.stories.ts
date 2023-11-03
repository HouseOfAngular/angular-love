import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
  CardComponent,
  CardContentDirective,
  CardFooterDirective,
  CardHeaderDirective,
} from './card.component';

const meta: Meta<CardComponent> = {
  component: CardComponent,
  title: 'Shared UI / Cards',
  decorators: [
    moduleMetadata({
      imports: [CardFooterDirective, CardContentDirective, CardHeaderDirective],
    }),
  ],
};

export default meta;
type Story = StoryObj<CardComponent>;

const wrapper = (template: string) =>
  `<div style="width: 300px">${template}</div>`;
const content =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua';

export const regular: Story = {
  render: () => ({
    template: wrapper(`
      <angular-love-card>
        <div angularLoveCardHeader>Header</div>
        <div angularLoveCardContent>${content}</div>
        <div angularLoveCardFooter>Footer</div>
      </angular-love-card>
    `),
  }),
};

export const withImage: Story = {
  args: {
    imageSrc:
      'https://www.angular.love/wp-content/uploads/2023/10/Effortless-Angular-Deployment-with-Vercel-1.jpeg',
  },
  render: (args: CardComponent) => ({
    props: args,
    template: wrapper(`
      <angular-love-card [imageSrc]="imageSrc">
        <div angularLoveCardHeader>Lorem Ipsum</div>
        <div angularLoveCardContent>${content}</div>
        <div angularLoveCardFooter>Footer</div>
      </angular-love-card>
    `),
  }),
};

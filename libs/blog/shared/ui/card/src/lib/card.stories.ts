import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
  CardComponent,
  CardContentDirective,
  CardFooterDirective,
  CardHeaderDirective,
  CardHoverHighlightDirective,
} from './card.component';
import { CardSkeletonComponent } from './card-skeleton.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

const meta: Meta<CardComponent> = {
  component: CardComponent,
  title: 'Shared UI / Cards',
  decorators: [
    moduleMetadata({
      imports: [
        CardFooterDirective,
        CardContentDirective,
        CardHeaderDirective,
        CardHoverHighlightDirective,
        CardSkeletonComponent,
        NgxSkeletonLoaderModule,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<CardComponent>;

const wrapper = (template: string) =>
  `
  <div style="display: grid; grid-template-columns: 300px 300px; gap: 16px;">
     <div>
          ${template}
    </div>
    <div>
      <angular-love-card-skeleton [withImage]="true">
            <div angularLoveCardHeader>
                <ngx-skeleton-loader [theme]="{ 'margin-bottom': '12px' }"></ngx-skeleton-loader>
            </div>
            <div angularLoveCardContent>
                <ngx-skeleton-loader [theme]="{ width: '100%', 'margin-bottom': '0' }" [count]="3"></ngx-skeleton-loader>
            </div>
            <div angularLoveCardFooter>
              <ngx-skeleton-loader  [theme]="{ width: '100%', 'margin-bottom': '0' }"></ngx-skeleton-loader>
            </div>
      </angular-love-card-skeleton>
     </div>
  </div>
`;
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

export const highlighted: Story = {
  args: {
    imageSrc:
      'https://www.angular.love/wp-content/uploads/2023/10/Effortless-Angular-Deployment-with-Vercel-1.jpeg',
  },
  render: (args: CardComponent) => ({
    props: args,
    template: wrapper(`
      <angular-love-card angularLoveCardHoverHighlight>
        <div angularLoveCardHeader>Lorem Ipsum</div>
        <div angularLoveCardContent>${content}</div>
        <div angularLoveCardFooter>Footer</div>
      </angular-love-card>
    `),
  }),
};

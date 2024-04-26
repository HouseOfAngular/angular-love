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
  title: 'Shared ui / Cards',
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
      <al-card-skeleton [withImage]="true">
            <div alCardHeader>
                <ngx-skeleton-loader [theme]="{ 'margin-bottom': '12px' }"></ngx-skeleton-loader>
            </div>
            <div alCardContent>
                <ngx-skeleton-loader [theme]="{ width: '100%', 'margin-bottom': '0' }" [count]="3"></ngx-skeleton-loader>
            </div>
            <div alCardFooter>
              <ngx-skeleton-loader  [theme]="{ width: '100%', 'margin-bottom': '0' }"></ngx-skeleton-loader>
            </div>
      </al-card-skeleton>
     </div>
  </div>
`;
const content =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua';

export const regular: Story = {
  render: () => ({
    template: wrapper(`
      <al-card>
        <div alCardHeader>Header</div>
        <div alCardContent>${content}</div>
        <div alCardFooter>Footer</div>
      </al-card>
    `),
  }),
};

export const withImage: Story = {
  args: {
    imageSrc:
      'https://www.angular.love/wp-content/uploads/2023/10/Effortless-Angular-Deployment-with-Vercel-1.jpeg',
  },
  render: (args) => ({
    props: args,
    template: wrapper(`
      <al-card [imageSrc]="imageSrc">
        <div alCardHeader>Lorem Ipsum</div>
        <div alCardContent>${content}</div>
        <div alCardFooter>Footer</div>
      </al-card>
    `),
  }),
};

export const highlighted: Story = {
  args: {
    imageSrc:
      'https://www.angular.love/wp-content/uploads/2023/10/Effortless-Angular-Deployment-with-Vercel-1.jpeg',
  },
  render: (args) => ({
    props: args,
    template: wrapper(`
      <al-card alCardHoverHighlight>
        <div alCardHeader>Lorem Ipsum</div>
        <div alCardContent>${content}</div>
        <div alCardFooter>Footer</div>
      </al-card>
    `),
  }),
};

import { Meta, StoryObj } from '@storybook/angular';
import { PaginationComponent } from './pagination.component';

const meta: Meta<PaginationComponent> = {
  component: PaginationComponent,
  title: 'Shared UI / Pagination',
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

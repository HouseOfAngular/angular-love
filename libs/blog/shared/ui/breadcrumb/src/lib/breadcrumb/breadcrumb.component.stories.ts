import { Meta, StoryObj } from '@storybook/angular';

import { BreadcrumbComponent } from './breadcrumb.component';

const meta: Meta<BreadcrumbComponent> = {
  component: BreadcrumbComponent,
  title: 'Shared UI / BreadCrumb',
};

export default meta;
type Story = StoryObj<BreadcrumbComponent>;

export const Primary: Story = {
  args: {
    pageName: 'Home',
  },
};

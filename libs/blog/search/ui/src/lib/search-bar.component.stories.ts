import type { Meta, StoryObj } from '@storybook/angular';
import { SearchBarComponent } from '@angular-love/blog/search/ui';

const meta: Meta<SearchBarComponent> = {
  component: SearchBarComponent,
  title: 'Search / Search Bar',
};

export default meta;

type Story = StoryObj<SearchBarComponent>;

export const icons: Story = {
  render: () => ({
    template: `
      <div>
        <angular-love-search-bar></angular-love-search-bar>
      </div>
    `,
  }),
};

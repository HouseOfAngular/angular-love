import { Component, input } from '@angular/core';

@Component({
  selector: 'al-ui-roadmap-node',
  template: `
    <div class="flex flex-col space-x-2 bg-gray-300">
      <div class="text-lg">{{ data().title }}</div>
      <div class="text-sm text-gray-500">{{ data().description }}</div>
    </div>
  `,
  host: {
    class: 'flex flex-col',
  },
})
export class UiRoadmapNodeComponent {
  readonly data = input.required<{ title: string; description: string }>();
}

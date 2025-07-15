import { Component, input } from '@angular/core';

@Component({
  selector: 'al-roadmap-bottomsheet-subtitle',
  template: `
    <h4 class="font-semibold">{{ title() }}</h4>
    <div class="h-px flex-grow bg-white"></div>
  `,
  host: {
    class: 'flex items-center gap-4',
  },
})
export class RoadmapBottomsheetSubtitleComponent {
  readonly title = input.required<string>();
}

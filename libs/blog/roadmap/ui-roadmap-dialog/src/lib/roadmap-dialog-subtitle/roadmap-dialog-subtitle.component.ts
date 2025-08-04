import { Component, input } from '@angular/core';

@Component({
  selector: 'al-roadmap-dialog-subtitle',
  template: `
    <h4 class="font-semibold">
      {{ subtitle() }}
    </h4>
    <div class="h-px flex-grow bg-white"></div>
  `,
  host: {
    class: 'flex items-center gap-4',
  },
})
export class RoadmapDialogSubtitleComponent {
  readonly subtitle = input.required<string>();
}

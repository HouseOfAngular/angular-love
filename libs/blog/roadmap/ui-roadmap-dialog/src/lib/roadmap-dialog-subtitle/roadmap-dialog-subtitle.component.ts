import { Component, input } from '@angular/core';

@Component({
  selector: 'al-roadmap-dialog-subtitle',
  template: `
    <h4 class="text-al-primary-foreground font-semibold">
      {{ subtitle() }}
    </h4>
    <div class="bg-al-primary-foreground h-px grow"></div>
  `,
  host: {
    class: 'flex items-center gap-4',
  },
})
export class RoadmapDialogSubtitleComponent {
  readonly subtitle = input.required<string>();
}

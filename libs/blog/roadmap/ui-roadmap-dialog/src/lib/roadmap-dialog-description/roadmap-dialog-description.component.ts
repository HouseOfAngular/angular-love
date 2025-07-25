import { Component, input } from '@angular/core';

import { RoadmapDialogSubtitleComponent } from '../roadmap-dialog-subtitle/roadmap-dialog-subtitle.component';

@Component({
  imports: [RoadmapDialogSubtitleComponent],
  selector: 'al-roadmap-dialog-description',
  template: `
    <section class="px-6 pt-6">
      <al-roadmap-dialog-subtitle [title]="title()" />
      <div class="pt-4">
        <p class="text-justify leading-8">{{ description() }}</p>
      </div>
    </section>
  `,
})
export class RoadmapDialogDescriptionComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}

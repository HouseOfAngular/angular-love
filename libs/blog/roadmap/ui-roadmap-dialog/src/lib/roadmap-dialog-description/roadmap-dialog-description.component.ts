import { Component, input } from '@angular/core';

import { RoadmapDialogSubtitleComponent } from '../roadmap-dialog-subtitle/roadmap-dialog-subtitle.component';

@Component({
  selector: 'al-roadmap-dialog-description',
  template: `
    <section class="px-6 pt-6">
      <al-roadmap-dialog-subtitle [subtitle]="subtitle()" />
      <div class="pt-4">
        <p class="text-al-primary-foreground  text-justify leading-8">
          {{ description() }}
        </p>
      </div>
    </section>
  `,
  imports: [RoadmapDialogSubtitleComponent],
})
export class RoadmapDialogDescriptionComponent {
  readonly subtitle = input.required<string>();
  readonly description = input.required<string>();
}

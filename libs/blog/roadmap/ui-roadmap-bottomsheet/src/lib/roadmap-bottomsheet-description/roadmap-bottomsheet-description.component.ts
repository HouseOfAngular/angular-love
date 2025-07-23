import { Component, input } from '@angular/core';

import { RoadmapBottomsheetSubtitleComponent } from '../roadmap-bottomsheet-subtitle/roadmap-bottomsheet-subtitle.component';

@Component({
  imports: [RoadmapBottomsheetSubtitleComponent],
  selector: 'al-roadmap-bottomsheet-description',
  template: `
    <div class="px-6 pt-6">
      <al-roadmap-bottomsheet-subtitle [title]="title()" />
      <div class="pt-4">
        <p class="text-justify leading-8">{{ description() }}</p>
      </div>
    </div>
  `,
})
export class RoadmapBottomsheetDescriptionComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}

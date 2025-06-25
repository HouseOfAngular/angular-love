import { Component, input } from '@angular/core';

import { ListPipe } from '@angular-love/roadmap-utils';

import { RoadmapBottomsheetSubtitleComponent } from '../roadmap-bottomsheet-subtitle/roadmap-bottomsheet-subtitle.component';

@Component({
  imports: [ListPipe, RoadmapBottomsheetSubtitleComponent],
  selector: 'al-roadmap-bottomsheet-description',
  template: `
    <div class="px-6 pt-6">
      <al-roadmap-bottomsheet-subtitle [title]="title()" />
      <div class="pt-4">
        @if (!additional()) {
          <p class="text-justify leading-8">{{ description() }}</p>
        } @else {
          <div [innerHTML]="description() | alListPipe"></div>
        }
      </div>
    </div>
  `,
})
export class RoadmapBottomsheetDescriptionComponent {
  title = input.required<string>();
  description = input.required<string>();
  additional = input<boolean>(false);
}

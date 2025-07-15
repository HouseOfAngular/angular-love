import { Component, input } from '@angular/core';

import { AdditionalDescription } from '@angular-love/blog/roadmap/ui-roadmap-node';

import { RoadmapBottomsheetSubtitleComponent } from '../roadmap-bottomsheet-subtitle/roadmap-bottomsheet-subtitle.component';

@Component({
  imports: [RoadmapBottomsheetSubtitleComponent],
  selector: 'al-roadmap-bottomsheet-additional-description',
  template: `
    <div class="px-6 pt-6">
      <al-roadmap-bottomsheet-subtitle [title]="title()" />
      <div class="pt-4 leading-8">
        <p>
          {{ additionalDescription().introduction }}
        </p>
        <ul class="px-6">
          @for (
            listElement of additionalDescription().toPrepareList;
            track $index
          ) {
            <li class="list-disc">{{ listElement }}</li>
          }
        </ul>
        <p>
          {{ additionalDescription().ending }}
        </p>
      </div>
    </div>
  `,
})
export class RoadmapBottomsheetAdditionalDescriptionComponent {
  readonly title = input.required<string>();
  readonly additionalDescription = input.required<AdditionalDescription>();
}

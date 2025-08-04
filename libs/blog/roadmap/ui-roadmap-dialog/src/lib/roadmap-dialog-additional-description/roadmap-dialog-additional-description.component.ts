import { Component, input } from '@angular/core';

import { AdditionalDescription } from '@angular-love/blog/roadmap/ui-roadmap-node';

import { RoadmapDialogSubtitleComponent } from '../roadmap-dialog-subtitle/roadmap-dialog-subtitle.component';

@Component({
  selector: 'al-roadmap-dialog-additional-description',
  template: `
    <section class="px-6 pt-6">
      <al-roadmap-dialog-subtitle [subtitle]="subtitle()" />
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
    </section>
  `,
  imports: [RoadmapDialogSubtitleComponent],
})
export class RoadmapDialogAdditionalDescriptionComponent {
  readonly subtitle = input.required<string>();
  readonly additionalDescription = input.required<AdditionalDescription>();
}

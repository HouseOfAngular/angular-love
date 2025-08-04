import { Component, input } from '@angular/core';

import { Creator } from '@angular-love/blog/roadmap/ui-roadmap-node';

import { RoadmapDialogSubtitleComponent } from '../roadmap-dialog-subtitle/roadmap-dialog-subtitle.component';

@Component({
  selector: 'al-roadmap-dialog-creators',
  template: `
    <section class="px-6 pt-6">
      <al-roadmap-dialog-subtitle [subtitle]="subtitle()" />
      <ul class="list-disc px-6 pt-4">
        @for (creator of creators(); track creator.name) {
          <li class="py-1 underline">
            <a [href]="'author/' + creator.slug" target="_blank">
              {{ creator.name }}
            </a>
          </li>
        }
      </ul>
    </section>
  `,
  imports: [RoadmapDialogSubtitleComponent],
})
export class RoadmapDialogCreatorsComponent {
  readonly subtitle = input.required<string>();
  readonly creators = input.required<Creator[]>();
}

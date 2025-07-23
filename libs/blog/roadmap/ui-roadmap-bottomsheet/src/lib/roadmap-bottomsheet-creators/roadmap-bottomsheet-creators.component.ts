import { Component, input } from '@angular/core';

import { Creator } from '@angular-love/blog/roadmap/ui-roadmap-node';

import { RoadmapBottomsheetSubtitleComponent } from '../roadmap-bottomsheet-subtitle/roadmap-bottomsheet-subtitle.component';

@Component({
  imports: [RoadmapBottomsheetSubtitleComponent],
  selector: 'al-roadmap-bottomsheet-creators',
  template: `
    <div class="px-6 pt-6">
      <al-roadmap-bottomsheet-subtitle [title]="title()" />
      <ul class="list-disc px-6 pt-4">
        @for (creator of creators(); track creator.name) {
          <li class="py-1 underline">
            <a [href]="'author/' + creator.slug" target="_blank">
              {{ creator.name }}
            </a>
          </li>
        }
      </ul>
    </div>
  `,
})
export class RoadmapBottomsheetCreatorsComponent {
  readonly title = input.required<string>();
  readonly creators = input.required<Creator[]>();
}

import { Component, input } from '@angular/core';

import { Resource } from '@angular-love/blog/contracts/roadmap';

import { RoadmapBottomsheetSubtitleComponent } from '../roadmap-bottomsheet-subtitle/roadmap-bottomsheet-subtitle.component';

@Component({
  imports: [RoadmapBottomsheetSubtitleComponent],
  selector: 'al-roadmap-bottomsheet-regular-content',
  template: `
    <div class="px-6 pt-6">
      <al-roadmap-bottomsheet-subtitle [title]="title()" />
      <ul class="list-disc px-6 pt-4">
        @for (resource of resources(); track resource.name) {
          <li class="py-1 underline">
            <a [href]="resource.url" target="_blank">
              {{ resource.name }}
            </a>
          </li>
        }
      </ul>
    </div>
  `,
})
export class RoadmapBottomsheetRegularContentComponent {
  readonly title = input.required<string>();
  readonly resources = input.required<Resource[]>();
}

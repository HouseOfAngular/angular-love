import { Component, input } from '@angular/core';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { ContentSlug } from '../../../../utils/src/lib/models/content-slug.type';
import { RoadmapBottomsheetSubtitleComponent } from '../roadmap-bottomsheet-subtitle/roadmap-bottomsheet-subtitle.component';

@Component({
  imports: [RoadmapBottomsheetSubtitleComponent],
  selector: 'al-roadmap-bottomsheet-regular-content',
  template: `
    <div class="px-6 pt-6">
      <al-roadmap-bottomsheet-subtitle [title]="title()" />
      <ul class="list-disc px-6 pt-4">
        @for (contentItem of contentSlugs(); track contentItem.title) {
          <li class="py-1 underline">
            <a [href]="contentItem.url" target="_blank">
              {{ contentItem.title }}
            </a>
          </li>
        }
      </ul>
    </div>
  `,
})
export class RoadmapBottomsheetRegularContentComponent {
  title = input.required<string>();
  contentSlugs = input.required<ContentSlug[]>();
}

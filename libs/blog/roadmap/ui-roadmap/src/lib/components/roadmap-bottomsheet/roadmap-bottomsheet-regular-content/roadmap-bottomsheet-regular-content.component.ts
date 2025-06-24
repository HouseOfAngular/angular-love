import { Component, input } from '@angular/core';

import { ContentSlug } from '@angular-love/roadmap-utils';

import { RoadmapBottomsheetSubtitleComponent } from '../roadmap-bottomsheet-subtitle/roadmap-bottomsheet-subtitle.component';

@Component({
  imports: [RoadmapBottomsheetSubtitleComponent],
  selector: 'al-roadmap-bottomsheet-regular-content',
  templateUrl: 'roadmap-bottomsheet-regular-content.component.html',
  standalone: true,
})
export class RoadmapBottomsheetRegularContentComponent {
  title = input.required<string>();
  contentSlugs = input.required<ContentSlug[]>();
}

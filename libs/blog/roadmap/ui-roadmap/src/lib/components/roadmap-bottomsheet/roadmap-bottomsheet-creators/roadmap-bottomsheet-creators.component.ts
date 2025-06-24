import { Component, input } from '@angular/core';

import { Creator } from '@angular-love/roadmap-utils';

import { RoadmapBottomsheetSubtitleComponent } from '../roadmap-bottomsheet-subtitle/roadmap-bottomsheet-subtitle.component';

@Component({
  imports: [RoadmapBottomsheetSubtitleComponent],
  selector: 'al-roadmap-bottomsheet-creators',
  templateUrl: 'roadmap-bottomsheet-creators.component.html',
  standalone: true,
})
export class RoadmapBottomsheetCreatorsComponent {
  title = input.required<string>();
  creators = input.required<Creator[]>();
}

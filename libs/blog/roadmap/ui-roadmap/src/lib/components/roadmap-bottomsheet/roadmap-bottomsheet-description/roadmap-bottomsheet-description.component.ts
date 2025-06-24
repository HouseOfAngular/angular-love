import { Component, input } from '@angular/core';

import { ListPipe } from '@angular-love/roadmap-utils';

import { RoadmapBottomsheetSubtitleComponent } from '../roadmap-bottomsheet-subtitle/roadmap-bottomsheet-subtitle.component';

@Component({
  imports: [ListPipe, RoadmapBottomsheetSubtitleComponent],
  selector: 'al-roadmap-bottomsheet-description',
  templateUrl: 'roadmap-bottomsheet-description.component.html',
  standalone: true,
})
export class RoadmapBottomsheetDescriptionComponent {
  title = input.required<string>();
  description = input.required<string>();
  additional = input<boolean>(false);
}

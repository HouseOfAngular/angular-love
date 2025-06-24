import { Component, input } from '@angular/core';

@Component({
  selector: 'al-roadmap-bottomsheet-subtitle',
  templateUrl: 'roadmap-bottomsheet-subtitle.component.html',
  standalone: true,
  host: {
    class: 'flex items-center gap-4',
  },
})
export class RoadmapBottomsheetSubtitleComponent {
  title = input.required<string>();
}

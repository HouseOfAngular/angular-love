import { Component, input } from '@angular/core';

@Component({
  selector: 'al-roadmap-bottomsheet-description',
  templateUrl: 'roadmap-bottomsheet-description.component.html',
})
export class RoadmapBottomsheetDescriptionComponent {
  description = input.required<string>();
}

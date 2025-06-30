import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { RoadmapNodeDTO } from '@angular-love/blog/contracts/roadmap';

@Component({
  selector: 'al-roadmap-bottomsheet-header',
  imports: [TitleCasePipe, NgClass],
  templateUrl: './roadmap-bottomsheet-header.component.html',
  styleUrl: 'roadmap-bottomsheet-header.component.scss',
})
export class RoadmapBottomsheetHeaderComponent {
  nodeType = input.required<RoadmapNodeDTO['nodeType']>();
  title = input.required<string>();
}

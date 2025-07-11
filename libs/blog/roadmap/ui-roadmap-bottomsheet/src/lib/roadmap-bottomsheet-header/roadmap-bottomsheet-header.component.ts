import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { RoadmapStandardNode } from '@angular-love/blog/roadmap/ui-roadmap-node';

@Component({
  selector: 'al-roadmap-bottomsheet-header',
  imports: [TitleCasePipe, NgClass],
  templateUrl: './roadmap-bottomsheet-header.component.html',
})
export class RoadmapBottomsheetHeaderComponent {
  nodeType = input.required<RoadmapStandardNode['nodeType']>();
  title = input.required<string>();
}

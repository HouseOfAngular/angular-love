import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { NodeDetails } from '@angular-love/roadmap-utils';

@Component({
  selector: 'al-roadmap-bottomsheet-header',
  imports: [TitleCasePipe, NgClass],
  templateUrl: './roadmap-bottomsheet-header.component.html',
  styleUrl: 'roadmap-bottomsheet-header.component.scss',
})
export class RoadmapBottomsheetHeaderComponent {
  nodeType = input.required<NodeDetails['nodeType']>();
  title = input.required<string>();
}

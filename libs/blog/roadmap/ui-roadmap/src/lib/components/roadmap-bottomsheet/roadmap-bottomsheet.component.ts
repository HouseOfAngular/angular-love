import { NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';

import { RoadmapBottomsheetService } from '@angular-love/roadmap-utils';

@Component({
  imports: [NgClass],
  selector: 'al-roadmap-bottomsheet',
  templateUrl: './roadmap-bottomsheet.component.html',
  styleUrl: 'roadmap-bottomsheet.component.scss',
  host: {
    '[style.display]': 'nodeDetails() ? "block" : "none"',
    '[class.visible]': 'nodeDetails() !== undefined',
  },
})
export class RoadmapBottomsheetComponent {
  private readonly _roadmapBottomsheetService = inject(
    RoadmapBottomsheetService,
  );

  protected readonly nodeDetails = this._roadmapBottomsheetService.nodeDetails;
  protected readonly angularLoveNodeDetails =
    this._roadmapBottomsheetService.angularLoveNodeDetails;
  protected readonly regularNodeDetails =
    this._roadmapBottomsheetService.regularNodeDetails;

  protected readonly isContentInRegularNodeDetails = computed(() => {
    const regularNodeDetails = this.regularNodeDetails();
    if (regularNodeDetails?.movies.length && regularNodeDetails.articles.length)
      return true;
    else return false;
  });

  handleOverlayClick(): void {
    this._roadmapBottomsheetService.close();
  }

  scroll($event: any) {
    console.log($event);
    $event.stopPropagation();
  }
}

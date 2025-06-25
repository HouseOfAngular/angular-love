import { NgClass } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';

import { ButtonComponent } from '@angular-love/blog/shared/ui-button';
import { RoadmapBottomsheetService } from '@angular-love/roadmap-utils';

import { RoadmapBottomsheetCreatorsComponent } from './roadmap-bottomsheet-creators/roadmap-bottomsheet-creators.component';
import { RoadmapBottomsheetDescriptionComponent } from './roadmap-bottomsheet-description/roadmap-bottomsheet-description.component';
import { RoadmapBottomsheetFooterComponent } from './roadmap-bottomsheet-footer/roadmap-bottomsheet-footer.component';
import { RoadmapBottomsheetHeaderComponent } from './roadmap-bottomsheet-header/roadmap-bottomsheet-header.component';
import { RoadmapBottomsheetRegularContentComponent } from './roadmap-bottomsheet-regular-content/roadmap-bottomsheet-regular-content.component';

@Component({
  imports: [
    NgClass,
    RoadmapBottomsheetHeaderComponent,
    RoadmapBottomsheetDescriptionComponent,
    RoadmapBottomsheetRegularContentComponent,
    RoadmapBottomsheetCreatorsComponent,
    ButtonComponent,
    RoadmapBottomsheetFooterComponent,
  ],
  selector: 'al-roadmap-bottomsheet',
  templateUrl: './roadmap-bottomsheet.component.html',
  styles: `
    .bottomsheet {
      &.visible {
        animation: fadeInBottom 1s forwards;
      }
    }

    @keyframes fadeInBottom {
      from {
        opacity: 0;
        transform: translateY(100%);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  host: {
    '[style.display]': 'nodeDetails() ? "block" : "none"',
    '[class.visible]': 'nodeDetails() !== undefined',
  },
  standalone: true,
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

  language = input.required<string>();

  handleOverlayClick(): void {
    this._roadmapBottomsheetService.close();
  }
}

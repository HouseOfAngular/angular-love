import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';

import { RoadmapNodeDTO } from '@angular-love/blog/contracts/roadmap';
import { RoadmapBottomsheetComponent } from '@angular-love/ui-roadmap-bottomsheet';

@Injectable({ providedIn: 'root' })
export class RoadmapBottomsheetManagerService {
  private dialog = inject(Dialog);

  open(roadmapNode: RoadmapNodeDTO) {
    this.dialog.open(RoadmapBottomsheetComponent, {
      data: roadmapNode,
    });
  }
}
